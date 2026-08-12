import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import { analyzeResumeAgainstJD } from "@/lib/analyzeResume";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, jobDescription: rawJobDescription } =
      await request.json();
    const jobDescription = (rawJobDescription || "").trim();

    if (!resumeId || !jobDescription || jobDescription.length < 30) {
      return NextResponse.json(
        {
          error: "A resume and a job description (30+ characters) are required",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const resume = await Resume.findOne({
      _id: resumeId,
      user: session.user.id,
    });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Same resume + same JD text should always yield the same verdict, so
    // reuse a prior analysis instead of hitting the LLM again. This also
    // sidesteps any residual model-to-model variance for the user.
    const cached = await Analysis.findOne({
      user: session.user.id,
      resume: resume._id,
      jobDescription,
    }).sort({ createdAt: -1 });

    if (cached) {
      return NextResponse.json(
        { analysis: cached, cached: true },
        { status: 200 },
      );
    }

    let result;
    try {
      result = await analyzeResumeAgainstJD(
        resume.extractedText,
        jobDescription,
      );
    } catch (err) {
      console.error("Failed to parse Groq JSON:", err);
      return NextResponse.json(
        {
          error:
            "Analysis failed — got an unreadable response. Please try again.",
        },
        { status: 502 },
      );
    }

    const analysis = await Analysis.create({
      user: session.user.id,
      resume: resume._id,
      jobDescription,
      ...result,
    }).catch((err) => {
      // Distinguish "the LLM call worked but saving the result failed" from
      // every other kind of failure, so logs (and eventually the user-facing
      // message) point at the right thing instead of a single vague bucket.
      console.error("Failed to save analysis to MongoDB:", err);
      throw new Error("SAVE_FAILED");
    });

    return NextResponse.json({ analysis, cached: false }, { status: 201 });
  } catch (error) {
    console.error("Analysis error:", error);

    if (error?.message === "SAVE_FAILED") {
      return NextResponse.json(
        {
          error:
            "Your analysis was generated but couldn't be saved. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong analyzing your resume." },
      { status: 500 },
    );
  }
}

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
    const { resumeId, jobDescription } = await request.json();

    if (!resumeId || !jobDescription || jobDescription.trim().length < 30) {
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
    });

    return NextResponse.json({ analysis }, { status: 201 });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong analyzing your resume." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import { analyzeResumeAgainstJD } from "@/lib/analyzeResume";

const MAX_JDS = 5; // keep it bounded so one request can't fan out unbounded Groq calls

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, jobDescriptions } = await request.json();

    if (
      !resumeId ||
      !Array.isArray(jobDescriptions) ||
      jobDescriptions.length < 2
    ) {
      return NextResponse.json(
        { error: "A resume and at least 2 job descriptions are required" },
        { status: 400 },
      );
    }

    if (jobDescriptions.length > MAX_JDS) {
      return NextResponse.json(
        { error: `You can compare up to ${MAX_JDS} job descriptions at once` },
        { status: 400 },
      );
    }

    const invalidIndex = jobDescriptions.findIndex(
      (jd) => !jd.text || jd.text.trim().length < 30,
    );
    if (invalidIndex !== -1) {
      return NextResponse.json(
        {
          error: `Job description #${invalidIndex + 1} needs at least 30 characters`,
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

    // Run all analyses in parallel — if one fails (bad JSON, transient API issue),
    // the others should still succeed rather than the whole request failing.
    const settled = await Promise.allSettled(
      jobDescriptions.map((jd) =>
        analyzeResumeAgainstJD(resume.extractedText, jd.text),
      ),
    );

    const results = [];
    for (let i = 0; i < settled.length; i++) {
      const outcome = settled[i];
      const label =
        jobDescriptions[i].label?.trim() || `Job description #${i + 1}`;

      if (outcome.status === "rejected") {
        results.push({
          label,
          error: "Analysis failed for this one — try again.",
        });
        continue;
      }

      const analysis = await Analysis.create({
        user: session.user.id,
        resume: resume._id,
        jobDescription: jobDescriptions[i].text,
        label,
        ...outcome.value,
      });

      results.push({
        _id: analysis._id.toString(),
        label,
        matchScore: analysis.matchScore,
        summary: analysis.summary,
      });
    }

    // Highest score first, so the best match is immediately obvious.
    results.sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1));

    return NextResponse.json({ results }, { status: 201 });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Something went wrong running the comparison." },
      { status: 500 },
    );
  }
}

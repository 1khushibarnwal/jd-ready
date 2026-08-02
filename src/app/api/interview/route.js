import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import InterviewSession from "@/models/InterviewSession";
import { generateInterviewQuestions } from "@/lib/interviewPrep";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const sessions = await InterviewSession.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .populate("resume", "filename")
    .lean();

  return NextResponse.json({ sessions });
}

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

    let questions;
    try {
      questions = await generateInterviewQuestions(
        resume.extractedText,
        jobDescription,
      );
    } catch (err) {
      console.error("Question generation error:", err);
      return NextResponse.json(
        { error: "Couldn't generate questions. Please try again." },
        { status: 502 },
      );
    }

    const interviewSession = await InterviewSession.create({
      user: session.user.id,
      resume: resume._id,
      jobDescription,
      questions,
      answers: [],
    });

    return NextResponse.json({ session: interviewSession }, { status: 201 });
  } catch (error) {
    console.error("Interview session creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong starting the interview." },
      { status: 500 },
    );
  }
}

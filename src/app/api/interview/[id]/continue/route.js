import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import { generateInterviewQuestions } from "@/lib/interviewPrep";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();

    const interviewSession = await InterviewSession.findOne({
      _id: id,
      user: session.user.id,
    }).populate("resume");

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const existingQuestionTexts = interviewSession.questions.map((q) => q.text);

    let newQuestions;
    try {
      newQuestions = await generateInterviewQuestions(
        interviewSession.resume.extractedText,
        interviewSession.jobDescription,
        existingQuestionTexts,
      );
    } catch (err) {
      console.error("Round continuation question generation error:", err);
      return NextResponse.json(
        { error: "Couldn't generate the next round. Please try again." },
        { status: 502 },
      );
    }

    const startIndex = interviewSession.questions.length;
    interviewSession.questions.push(...newQuestions);
    await interviewSession.save();

    return NextResponse.json({ newQuestions, startIndex });
  } catch (error) {
    console.error("Round continuation error:", error);
    return NextResponse.json(
      { error: "Something went wrong starting the next round." },
      { status: 500 },
    );
  }
}

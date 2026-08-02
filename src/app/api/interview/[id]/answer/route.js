import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import Resume from "@/models/Resume";
import { evaluateInterviewAnswer } from "@/lib/interviewPrep";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { questionIndex, answerText } = await request.json();

    if (
      typeof questionIndex !== "number" ||
      !answerText ||
      answerText.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "An answer of at least 10 characters is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const interviewSession = await InterviewSession.findOne({
      _id: id,
      user: session.user.id,
    }).populate("resume");

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const question = interviewSession.questions[questionIndex];
    if (!question) {
      return NextResponse.json(
        { error: "Invalid question index" },
        { status: 400 },
      );
    }

    let feedback;
    try {
      feedback = await evaluateInterviewAnswer({
        question: question.text,
        resumeText: interviewSession.resume.extractedText,
        jobDescription: interviewSession.jobDescription,
        answerText,
      });
    } catch (err) {
      console.error("Answer evaluation error:", err);
      return NextResponse.json(
        { error: "Couldn't evaluate that answer. Please try again." },
        { status: 502 },
      );
    }

    const answerEntry = { questionIndex, answerText, ...feedback };

    // Replace any existing answer for this question (e.g. if they redo it),
    // otherwise append.
    const existingIndex = interviewSession.answers.findIndex(
      (a) => a.questionIndex === questionIndex,
    );
    if (existingIndex !== -1) {
      interviewSession.answers[existingIndex] = answerEntry;
    } else {
      interviewSession.answers.push(answerEntry);
    }

    await interviewSession.save();

    return NextResponse.json({ feedback: answerEntry });
  } catch (error) {
    console.error("Answer submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong submitting your answer." },
      { status: 500 },
    );
  }
}

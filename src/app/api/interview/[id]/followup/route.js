import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import { askInterviewFollowUp } from "@/lib/interviewPrep";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { questionIndex, message } = await request.json();

    if (
      typeof questionIndex !== "number" ||
      !message ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "A message is required" },
        { status: 400 },
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long" },
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

    const answerEntry = interviewSession.answers.find(
      (a) => a.questionIndex === questionIndex,
    );
    if (!answerEntry) {
      return NextResponse.json(
        {
          error: "Submit an answer to this question before asking a follow-up",
        },
        { status: 400 },
      );
    }

    let reply;
    try {
      reply = await askInterviewFollowUp({
        question: question.text,
        resumeText: interviewSession.resume.extractedText,
        jobDescription: interviewSession.jobDescription,
        answerText: answerEntry.answerText,
        feedback: answerEntry,
        history: answerEntry.followUps,
        message,
      });
    } catch (err) {
      console.error("Follow-up chat error:", err);
      return NextResponse.json(
        { error: "Couldn't get a response. Please try again." },
        { status: 502 },
      );
    }

    answerEntry.followUps.push({ role: "user", content: message });
    answerEntry.followUps.push({ role: "assistant", content: reply });

    await interviewSession.save();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Follow-up submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message." },
      { status: 500 },
    );
  }
}

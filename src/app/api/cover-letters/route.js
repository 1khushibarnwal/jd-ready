import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import CoverLetter from "@/models/CoverLetter";
import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are an expert professional cover letter writer.
Write a formal, professional cover letter tailored to the given job description, using
the candidate's resume text as the source of truth for their real experience and skills.

Rules:
- 3-4 paragraphs, plain text only (no markdown, no bullet points, no headers)
- Address it to "Dear Hiring Manager,"
- Do not invent experience, employers, or skills that aren't evidenced in the resume text
- Do not include placeholder brackets like [Company Name] — refer to the role/company
  generically (e.g. "this role", "your team") if the company name isn't given
- End with a professional closing (e.g. "Sincerely,") followed by the candidate's name
- Return ONLY the letter text, nothing else (no preamble, no explanation)`;

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const letters = await CoverLetter.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .populate("resume", "filename")
    .lean();

  return NextResponse.json({ letters });
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

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `CANDIDATE NAME: ${session.user.name}\n\nRESUME TEXT:\n${resume.extractedText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Empty response from Groq");
    }

    const coverLetter = await CoverLetter.create({
      user: session.user.id,
      resume: resume._id,
      jobDescription,
      content,
    });

    return NextResponse.json({ coverLetter }, { status: 201 });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong generating the cover letter." },
      { status: 500 },
    );
  }
}

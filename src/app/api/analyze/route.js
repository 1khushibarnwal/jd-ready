import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) and technical recruiter.
Compare the given resume text against the given job description and respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "matchScore": <integer 0-100>,
  "matchedSkills": [<strings — skills/requirements from the JD the resume already shows>],
  "missingSkills": [<strings — important skills/requirements from the JD not evidenced in the resume>],
  "suggestions": [<strings — concrete, actionable rewrite/addition suggestions>],
  "summary": <string — 2-3 sentence overall verdict>
}

Be specific and grounded only in the text provided. Do not invent skills that aren't implied by either document.`;

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
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `RESUME TEXT:\n${resume.extractedText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from Groq");
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse Groq JSON:", raw);
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
      matchScore: parsed.matchScore ?? 0,
      matchedSkills: parsed.matchedSkills ?? [],
      missingSkills: parsed.missingSkills ?? [],
      suggestions: parsed.suggestions ?? [],
      summary: parsed.summary ?? "",
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

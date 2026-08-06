import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import ResumeDraft from "@/models/ResumeDraft";
import { generateResumeFromJD } from "@/lib/generateResumeFromJD";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobDescription, skills } = await request.json();

    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json(
        { error: "A job description (30+ characters) is required" },
        { status: 400 },
      );
    }

    const skillsList = Array.isArray(skills)
      ? skills.map((s) => s.trim()).filter(Boolean)
      : String(skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    if (skillsList.length === 0) {
      return NextResponse.json(
        { error: "List at least one skill you know" },
        { status: 400 },
      );
    }

    await connectDB();

    let generated;
    try {
      generated = await generateResumeFromJD(jobDescription, skillsList);
    } catch (err) {
      console.error("Failed to parse Groq JSON:", err);
      return NextResponse.json(
        {
          error:
            "Couldn't generate resume content — got an unreadable response. Please try again.",
        },
        { status: 502 },
      );
    }

    // Merge into the user's existing draft rather than overwriting it, so any
    // contact info, experience, education, projects, or template choice they
    // already have is preserved — only the AI-authored fields are updated.
    const draft = await ResumeDraft.findOneAndUpdate(
      { user: session.user.id },
      {
        $set: {
          summary: generated.summary,
          skills: generated.skills,
          highlights: generated.highlights,
        },
        $setOnInsert: {
          fullName: session.user.name || "",
          email: session.user.email || "",
        },
      },
      { new: true, upsert: true },
    ).lean();

    return NextResponse.json({ draft }, { status: 200 });
  } catch (error) {
    console.error("Generate-from-JD error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume content" },
      { status: 500 },
    );
  }
}

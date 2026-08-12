import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { tweakResumeText } from "@/lib/tweakResume";

const MAX_EDITS = 20;
const MAX_EDIT_LENGTH = 500;

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, edits: rawEdits } = await request.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "A resume is required" },
        { status: 400 },
      );
    }

    // `edits` must be the exact, user-reviewed instruction strings — this route
    // never infers or auto-applies anything the user hasn't explicitly confirmed.
    const edits = Array.isArray(rawEdits)
      ? rawEdits
          .map((e) => (typeof e === "string" ? e.trim() : ""))
          .filter(Boolean)
      : [];

    if (edits.length === 0) {
      return NextResponse.json(
        { error: "Select at least one change to apply" },
        { status: 400 },
      );
    }

    if (edits.length > MAX_EDITS) {
      return NextResponse.json(
        { error: `Please apply at most ${MAX_EDITS} changes at a time` },
        { status: 400 },
      );
    }

    if (edits.some((e) => e.length > MAX_EDIT_LENGTH)) {
      return NextResponse.json(
        { error: "One of your edits is too long. Please shorten it." },
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

    let tweakedResumeText;
    try {
      tweakedResumeText = await tweakResumeText(resume.extractedText, edits);
    } catch (err) {
      console.error("Failed to tweak resume:", err);
      return NextResponse.json(
        {
          error:
            "Couldn't apply those changes — got an unreadable response. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { tweakedResumeText, appliedEdits: edits },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resume tweak error:", error);
    return NextResponse.json(
      { error: "Something went wrong tweaking your resume." },
      { status: 500 },
    );
  }
}

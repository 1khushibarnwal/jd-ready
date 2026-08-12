import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { suggestBulletWording } from "@/lib/suggestWording";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, jobDescription, suggestion } = await request.json();

    if (!resumeId || !jobDescription || !suggestion) {
      return NextResponse.json(
        { error: "resumeId, jobDescription, and suggestion are required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Re-fetch the resume text server-side (never trust client-supplied resume
    // content) and scope it to this user, same as the analyze/tweak routes.
    const resume = await Resume.findOne({
      _id: resumeId,
      user: session.user.id,
    });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    let result;
    try {
      result = await suggestBulletWording(
        resume.extractedText,
        jobDescription,
        suggestion,
      );
    } catch (err) {
      console.error("Failed to draft suggestion wording:", err);
      return NextResponse.json(
        { error: "Couldn't draft that suggestion. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Suggest-wording error:", error);
    return NextResponse.json(
      { error: "Something went wrong drafting that suggestion." },
      { status: 500 },
    );
  }
}

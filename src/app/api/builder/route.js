import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import ResumeDraft from "@/models/ResumeDraft";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  let draft = await ResumeDraft.findOne({ user: session.user.id }).lean();

  // Auto-create an empty draft on first visit so the frontend always has
  // something consistent to render, pre-filled with what we already know.
  if (!draft) {
    draft = await ResumeDraft.create({
      user: session.user.id,
      fullName: session.user.name || "",
      email: session.user.email || "",
    });
    draft = draft.toObject();
  }

  return NextResponse.json({ draft });
}

export async function PUT(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Only allow known fields to be written — never let arbitrary client
    // data overwrite `user` or other protected fields.
    const {
      fullName,
      email,
      phone,
      location,
      linkedin,
      portfolio,
      summary,
      template,
      experience,
      education,
      skills,
      projects,
      highlights,
    } = body;

    await connectDB();

    const draft = await ResumeDraft.findOneAndUpdate(
      { user: session.user.id },
      {
        fullName,
        email,
        phone,
        location,
        linkedin,
        portfolio,
        summary,
        template,
        experience,
        education,
        skills,
        projects,
        highlights,
      },
      { new: true, upsert: true },
    ).lean();

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Builder save error:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 },
    );
  }
}

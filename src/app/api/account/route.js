import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, signOut } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import CoverLetter from "@/models/CoverLetter";
import ResumeDraft from "@/models/ResumeDraft";
import cloudinary from "@/lib/cloudinary";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
});

export async function PUT(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    await connectDB();

    // Email doubles as the login identifier, so guard against collisions
    // with a *different* account before saving.
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Another account already uses this email" },
        { status: 409 },
      );
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true },
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await connectDB();

    // Best-effort cleanup of Cloudinary files — don't let a failed delete
    // there block the rest of account deletion.
    const resumes = await Resume.find({ user: userId })
      .select("cloudinaryPublicId")
      .lean();
    await Promise.allSettled(
      resumes.map((r) =>
        cloudinary.uploader.destroy(r.cloudinaryPublicId, {
          resource_type: "raw",
        }),
      ),
    );

    await Promise.all([
      Resume.deleteMany({ user: userId }),
      Analysis.deleteMany({ user: userId }),
      CoverLetter.deleteMany({ user: userId }),
      ResumeDraft.deleteMany({ user: userId }),
      User.deleteOne({ _id: userId }),
    ]);

    // Clear the session cookie so the (now-deleted) user is signed out.
    await signOut({ redirect: false });

    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Something went wrong deleting your account." },
      { status: 500 },
    );
  }
}

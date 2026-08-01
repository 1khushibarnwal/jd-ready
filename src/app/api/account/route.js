import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import CoverLetter from "@/models/CoverLetter";
import ResumeDraft from "@/models/ResumeDraft";
import cloudinary from "@/lib/cloudinary";

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

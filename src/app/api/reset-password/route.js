import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const schema = z.object({
  email: z.string().trim().email(),
  token: z.string().min(1, "Missing reset token"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const { email, token, password } = parsed.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "This reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

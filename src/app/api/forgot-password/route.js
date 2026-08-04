import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

// Always the same message, whether or not the account exists — this prevents
// using this endpoint to check which emails have accounts.
const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

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

    const { email } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordTokenHash = tokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const origin = new URL(request.url).origin;
      const resetUrl = `${origin}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

      try {
        await sendPasswordResetEmail(email, resetUrl);
      } catch (err) {
        // Log but still return the generic success message — don't leak
        // email-sending failures to the client, and don't block the response.
        console.error("Failed to send password reset email:", err);
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

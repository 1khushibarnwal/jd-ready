import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetUrl) {
  await resend.emails.send({
    // resend.dev works out of the box with no domain verification needed,
    // but only delivers to the email you signed up to Resend with — switch
    // to a verified sending domain once you have one for real users.
    from: "JDReady <onboarding@resend.dev>",
    to,
    subject: "Reset your JDReady password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1b2559;">Reset your password</h2>
        <p>We got a request to reset the password for your JDReady account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #1b2559; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 12px 0;">
            Reset password
          </a>
        </p>
        <p style="color: #5a6478; font-size: 13px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

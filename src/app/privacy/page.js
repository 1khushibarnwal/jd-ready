import { auth } from "@/auth";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import FadeIn from "@/components/animations/FadeIn";

export const metadata = {
  title: "Privacy Policy — JDReady",
  description: "What JDReady collects, why, and how to delete it.",
};

const LAST_UPDATED = "August 2026"; // update this whenever the policy changes

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-7 text-ink-secondary">
        {children}
      </div>
    </div>
  );
}

export default async function PrivacyPage() {
  const session = await auth();

  return (
    <div className="bg-background">
      <Header session={session} />

      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-ink-secondary">
            Last updated: {LAST_UPDATED}
          </p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <p className="mt-6 leading-8 text-ink-secondary">
            This page explains what JDReady collects when you use it, why, and
            what control you have over it. It&apos;s written in plain language
            rather than legal boilerplate — if anything here is unclear, reach
            out through the contact link at the bottom.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Section title="What we collect">
            <p>
              <strong className="text-ink">Account info:</strong> your name,
              email address, and a bcrypt-hashed password (we never store or can
              see your actual password).
            </p>
            <p>
              <strong className="text-ink">Resume &amp; job data:</strong>{" "}
              resumes you upload or build, job descriptions you paste in, the
              analyses, match scores, and skill gaps generated from them, cover
              letters, and mock interview sessions (your answers and the
              feedback given).
            </p>
            <p>
              <strong className="text-ink">Optional profile fields:</strong>{" "}
              phone number, location, LinkedIn, and portfolio links, if you
              choose to add them in the resume builder.
            </p>
            <p>
              We don&apos;t collect payment information, and we don&apos;t run
              analytics or advertising trackers.
            </p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.14}>
          <Section title="How we use it">
            <p>
              Your resume and job description text is sent to an AI provider to
              generate match scores, skill gaps, resume content, cover letters,
              and interview questions/feedback — that&apos;s the core function
              of the product. Your email is used to let you log in and, if you
              request it, to send a password reset link. Everything else
              (history, drafts, sessions) exists so you can come back and pick
              up where you left off.
            </p>
            <p>We don&apos;t sell your data or share it with advertisers.</p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.18}>
          <Section title="Third-party services we use">
            <p>
              JDReady is built on a small number of infrastructure providers
              that process data on our behalf, under their own privacy and
              security terms:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-ink">MongoDB Atlas</strong> — stores
                your account and application data.
              </li>
              <li>
                <strong className="text-ink">Cloudinary</strong> — hosts
                uploaded and generated files (e.g. resumes).
              </li>
              <li>
                <strong className="text-ink">Groq</strong> — processes
                resume/job-description text to power analysis, generation, and
                interview features.
              </li>
              <li>
                <strong className="text-ink">Resend</strong> — sends
                transactional email (currently just password resets).
              </li>
            </ul>
            <p>
              We don&apos;t use any of these providers for advertising or to
              build a profile of you beyond what&apos;s needed to run the
              product.
            </p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.22}>
          <Section title="Cookies & sessions">
            <p>
              We use a session cookie to keep you logged in, and store your
              light/dark theme preference locally in your browser. We don&apos;t
              use third-party advertising or tracking cookies.
            </p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.26}>
          <Section title="How long we keep it, and deleting your data">
            <p>
              We keep your data for as long as your account exists, so your
              history stays available to you. You can delete individual items
              (analyses, cover letters, interview sessions) from your history at
              any time. You can also permanently delete your account and all
              associated data from account settings — this is irreversible.
            </p>
            <p>
              If you request a password reset, the reset link expires after a
              short window and can only be used once.
            </p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Section title="Your data, your access">
            <p>
              Your resumes, analyses, cover letters, and interview sessions are
              only ever visible to your own account — there&apos;s no
              cross-account access, and no one else can see your data unless you
              choose to share an exported file yourself.
            </p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.34}>
          <Section title="Changes to this policy">
            <p>
              If this policy changes in a meaningful way, we&apos;ll update the
              &quot;last updated&quot; date above. Significant changes affecting
              how your data is used will be communicated where reasonably
              possible.
            </p>
          </Section>
        </FadeIn>

        <FadeIn delay={0.38}>
          <Section title="Contact">
            <p>
              Questions about this policy or your data? Open an issue on{" "}
              <a
                href="https://github.com/1khushibarnwal/jd-ready"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline"
              >
                GitHub
              </a>
              .
            </p>
          </Section>
        </FadeIn>
      </main>

      <Footer session={session} />
    </div>
  );
}

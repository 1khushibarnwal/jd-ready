import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import ResumeDraft from "@/models/ResumeDraft";
import ResumeBuilder from "@/components/ResumeBuilder";

export default async function BuilderPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  let draft = await ResumeDraft.findOne({ user: session.user.id }).lean();

  if (!draft) {
    const created = await ResumeDraft.create({
      user: session.user.id,
      fullName: session.user.name || "",
      email: session.user.email || "",
    });
    draft = created.toObject();
  }

  // Strip Mongo-specific fields before passing to the client component —
  // it only needs the plain resume data.
  const initialDraft = JSON.parse(JSON.stringify(draft));

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Build your resume</h1>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline"
        >
          Back to dashboard
        </Link>
      </div>

      <ResumeBuilder initialDraft={initialDraft} />
    </div>
  );
}

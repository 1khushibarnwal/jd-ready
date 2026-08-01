import { redirect } from "next/navigation";
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
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">
        Build your resume
      </h1>

      <ResumeBuilder initialDraft={initialDraft} />
    </div>
  );
}

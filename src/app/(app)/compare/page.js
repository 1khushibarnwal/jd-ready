import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import CompareTool from "@/components/CompareTool";

export default async function ComparePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const resumes = await Resume.find({ user: session.user.id })
    .select("filename")
    .sort({ createdAt: -1 })
    .lean();

  const plainResumes = JSON.parse(JSON.stringify(resumes));

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        Compare against multiple jobs
      </h1>
      <p className="text-sm text-ink-secondary mb-8">
        Pick a resume and paste 2-5 job descriptions to see which one it matches
        best.
      </p>

      <CompareTool resumes={plainResumes} />
    </div>
  );
}

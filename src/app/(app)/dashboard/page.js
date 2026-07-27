import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="text-2xl font-semibold mb-1">Analyze your resume</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Upload your resume and paste a job description to see how well they
        match.
      </p>

      <ResumeAnalyzer />
    </div>
  );
}

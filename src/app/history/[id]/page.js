import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import Resume from "@/models/Resume";
import AnalysisResults from "@/components/AnalysisResults";

export default async function HistoryDetailPage({ params }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  await connectDB();

  // Scope the query to the logged-in user so nobody can view someone else's
  // analysis just by guessing/incrementing an id in the URL.
  const analysis = await Analysis.findOne({ _id: id, user: session.user.id })
    .populate("resume")
    .lean();

  if (!analysis) {
    notFound();
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            {analysis.resume?.filename || "Deleted resume"}
          </h1>
          <p className="text-sm text-neutral-500">
            {new Date(analysis.createdAt).toLocaleString()}
          </p>
        </div>
        <Link
          href="/history"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline shrink-0"
        >
          Back to history
        </Link>
      </div>

      {analysis.resume?.fileUrl && (
        <a
          href={analysis.resume.fileUrl}
          className="text-sm underline text-neutral-500 hover:text-neutral-900 block mb-6"
          download
        >
          Download original resume
        </a>
      )}

      <details className="mb-6 text-sm">
        <summary className="cursor-pointer font-medium text-neutral-700 hover:text-neutral-900">
          View job description
        </summary>
        <p className="mt-2 text-neutral-600 whitespace-pre-wrap border border-neutral-200 rounded-lg p-4">
          {analysis.jobDescription}
        </p>
      </details>

      <AnalysisResults analysis={analysis} />
    </div>
  );
}

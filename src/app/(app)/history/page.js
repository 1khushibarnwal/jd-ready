import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import Resume from "@/models/Resume"; // needed so populate('resume') can resolve the model

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default async function HistoryPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const analyses = await Analysis.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .populate("resume", "filename")
    .lean();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">
        Your analysis history
      </h1>

      {analyses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-ink-secondary">
          No analyses yet.{" "}
          <Link href="/dashboard" className="underline hover:text-ink">
            Run your first one
          </Link>
          .
        </div>
      ) : (
        <ul className="space-y-3">
          {analyses.map((analysis) => (
            <li key={analysis._id.toString()}>
              <Link
                href={`/history/${analysis._id}`}
                className="flex items-center justify-between gap-4 border border-border rounded-lg px-4 py-3 hover:border-ink-secondary transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {analysis.label ||
                      analysis.resume?.filename ||
                      "Deleted resume"}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {new Date(analysis.createdAt).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`font-mono text-lg font-semibold shrink-0 ${scoreColor(analysis.matchScore)}`}
                >
                  {analysis.matchScore}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

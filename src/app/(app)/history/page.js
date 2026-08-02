import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import Resume from "@/models/Resume"; // needed so populate('resume') can resolve the model
import HistoryList from "@/components/HistoryList";

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

  const plainAnalyses = JSON.parse(JSON.stringify(analyses));

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">
        Your analysis history
      </h1>
      <HistoryList initialAnalyses={plainAnalyses} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import Resume from "@/models/Resume";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const analyses = await Analysis.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .limit(15)
    .populate("resume", "filename")
    .lean();

  // Flatten to plain serializable objects for the client Sidebar component.
  const recentAnalyses = analyses.map((a) => ({
    _id: a._id.toString(),
    matchScore: a.matchScore,
    resumeFilename: a.resume?.filename || null,
  }));

  return (
    <div className="flex-1 flex w-full">
      <Sidebar
        user={{ name: session.user.name, email: session.user.email }}
        recentAnalyses={recentAnalyses}
      />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

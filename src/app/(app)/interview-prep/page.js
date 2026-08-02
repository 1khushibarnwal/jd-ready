import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import InterviewSession from "@/models/InterviewSession";
import InterviewPractice from "@/components/InterviewPractice";

export default async function InterviewPrepPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const [resumes, sessions] = await Promise.all([
    Resume.find({ user: session.user.id })
      .select("filename")
      .sort({ createdAt: -1 })
      .lean(),
    InterviewSession.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate("resume", "filename")
      .lean(),
  ]);

  const plainResumes = JSON.parse(JSON.stringify(resumes));
  const plainSessions = JSON.parse(JSON.stringify(sessions));

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        Practice interview questions
      </h1>
      <p className="text-sm text-ink-secondary mb-8">
        Get questions tailored to your resume and a job description, answer them
        one at a time, and get feedback on each response.
      </p>

      <InterviewPractice
        resumes={plainResumes}
        initialSessions={plainSessions}
      />
    </div>
  );
}

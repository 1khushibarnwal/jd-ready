import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import CoverLetter from "@/models/CoverLetter";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";

export default async function CoverLetterPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const [resumes, letters] = await Promise.all([
    Resume.find({ user: session.user.id })
      .select("filename")
      .sort({ createdAt: -1 })
      .lean(),
    CoverLetter.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate("resume", "filename")
      .lean(),
  ]);

  // Strip Mongo-specific fields for the client component.
  const plainResumes = JSON.parse(JSON.stringify(resumes));
  const plainLetters = JSON.parse(JSON.stringify(letters));

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="text-2xl font-semibold mb-1">Generate a cover letter</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Pick a resume you&apos;ve already uploaded, paste a job description, and
        get a tailored, professional cover letter.
      </p>

      <CoverLetterGenerator
        resumes={plainResumes}
        initialLetters={plainLetters}
      />
    </div>
  );
}

import {
  FileSearch,
  Layers,
  FileText,
  Sparkles,
  Mail,
  MessageCircle,
  History,
} from "lucide-react";

export const features = [
  {
    icon: FileSearch,
    title: "Resume analysis",
    description:
      "Upload your resume and a job description to get an instant match score, along with the specific skills you're missing.",
  },
  {
    icon: Layers,
    title: "Compare multiple jobs",
    description:
      "Paste in several job descriptions at once and see, ranked, which role your resume is actually the strongest fit for.",
  },
  {
    icon: FileText,
    title: "ATS-friendly builder",
    description:
      "No resume yet? Build one from scratch with a guided form, choose from multiple templates, and export a clean PDF that parses correctly.",
  },
  {
    icon: Sparkles,
    title: "Generate from a job description",
    description:
      "Paste a job description and the skills you already know, and get a tailored summary, prioritized skills, and strength bullets — using only what you actually know, never invented experience.",
  },
  {
    icon: Mail,
    title: "Cover letters",
    description:
      "Generate a tailored, professional cover letter from your resume and a job description in seconds.",
  },
  {
    icon: MessageCircle,
    title: "Mock interview practice",
    description:
      "Answer interview questions tailored to your resume and the role, get feedback on each answer, and keep going round after round.",
  },
  {
    icon: History,
    title: "Full history",
    description:
      "Every analysis, cover letter, and interview session is saved, so you can revisit past results any time.",
  },
];

export const steps = [
  {
    title: "Upload, build, or generate",
    description:
      "Upload an existing resume, build one from scratch with our guided form, or generate a starting point from a job description and the skills you know.",
  },
  {
    title: "Paste the job description",
    description:
      "Drop in the JD you're applying to — or several, if you're comparing options.",
  },
  {
    title: "Get your score & gaps",
    description:
      "See a match score, the skills you already show, and what's missing.",
  },
  {
    title: "Practice the interview",
    description:
      "Answer tailored questions and get feedback before the real thing.",
  },
  {
    title: "Download & apply",
    description:
      "Export an ATS-ready resume and a tailored cover letter, ready to send.",
  },
];

export const comparisonRows = [
  { label: "Instant match scoring", jdready: true, manual: false },
  { label: "Identifies missing keywords/skills", jdready: true, manual: false },
  { label: "ATS-friendly formatting built in", jdready: true, manual: false },
  { label: "Choice of resume templates", jdready: true, manual: false },
  {
    label: "Generate resume content from a JD + your skills",
    jdready: true,
    manual: false,
  },
  { label: "Tailored cover letter generation", jdready: true, manual: false },
  { label: "Compare several roles at once", jdready: true, manual: false },
  {
    label: "Mock interview practice with feedback",
    jdready: true,
    manual: false,
  },
  { label: "Takes more than a few minutes", jdready: false, manual: true },
];

export const faqs = [
  {
    q: "What file formats can I upload?",
    a: "JDReady accepts .pdf and .docx resume files. If you don't have one yet, you can build one from scratch instead.",
  },
  {
    q: "How is the match score calculated?",
    a: "An AI model compares your resume's actual content against the job description and scores the overlap. It's a guide to help you improve your resume — not a guarantee of interview outcomes.",
  },
  {
    q: "Can I choose what my resume looks like?",
    a: "Yes — the resume builder offers multiple templates (Minimal, Modern, Compact). All of them keep a single-column layout so they stay reliably ATS-parseable; only the styling differs.",
  },
  {
    q: "Can I generate a resume from just a job description and my skills?",
    a: "Yes — in the builder, paste a job description and the skills you know, and JDReady drafts a tailored summary, reorders your skills to match the role, and writes a few strength bullets. It only ever works from skills you actually list — it never invents employers, job titles, or experience for you. You can then fill in real experience and education, or edit anything it wrote, before downloading.",
  },
  {
    q: "How does the mock interview practice work?",
    a: "JDReady generates interview questions tailored to your resume and a job description, mixing behavioral and technical questions. Answer them one at a time and get feedback with a score, strengths, and suggestions — and you can keep going for as many rounds as you'd like.",
  },
  {
    q: "Is my resume data private?",
    a: "Your resumes, analyses, cover letters, and interview sessions are only visible to your account. We don't share your data with other users, and you can permanently delete your account and all associated data at any time from account settings.",
  },
  {
    q: "Do I need an existing resume to use JDReady?",
    a: "No — if you don't have one, the built-in resume builder walks you through creating an ATS-friendly resume from scratch, or you can generate a starting point from a job description and your skills.",
  },
  {
    q: "Can I use JDReady for more than one job application?",
    a: "Yes. Every resume, analysis, cover letter, and interview session is saved to your account, and you can compare one resume against multiple job descriptions at once.",
  },
];

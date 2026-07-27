"use client";

import { useState } from "react";

import AnalysisResults from "@/components/AnalysisResults";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null); // { resumeId, filename, fileUrl }
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("idle"); // idle | uploading | analyzing

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setAnalysis(null);

    if (!file) {
      setError("Please choose a resume file (.pdf or .docx)");
      return;
    }
    if (jobDescription.trim().length < 30) {
      setError("Paste a fuller job description (at least 30 characters)");
      return;
    }

    try {
      // Step 1: upload resume
      setStage("uploading");
      const formData = new FormData();
      formData.append("resume", file);

      const uploadRes = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error || "Upload failed");
        setStage("idle");
        return;
      }

      setResume(uploadData);

      // Step 2: analyze
      setStage("analyzing");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: uploadData.resumeId, jobDescription }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        setError(analyzeData.error || "Analysis failed");
        setStage("idle");
        return;
      }

      setAnalysis(analyzeData.analysis);
      setStage("idle");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStage("idle");
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setResume(null);
    setAnalysis(null);
    setError("");
    setStage("idle");
  }

  const isBusy = stage !== "idle";

  // If we already have a result, show it front-and-center with a way to start over,
  // rather than leaving the (now stale) form sitting above it.
  if (analysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Analyzed against:{" "}
            <span className="font-medium text-neutral-700">
              {resume?.filename}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline"
          >
            Analyze another
          </button>
        </div>

        {resume && (
          <a
            href={resume.fileUrl}
            className="text-sm underline text-neutral-500 hover:text-neutral-900"
            download
          >
            Download original resume
          </a>
        )}

        <AnalysisResults analysis={analysis} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="resume-file"
          >
            Resume (.pdf or .docx)
          </label>
          <input
            id="resume-file"
            type="file"
            accept=".pdf,.docx"
            disabled={isBusy}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm border border-neutral-300 rounded-md px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-neutral-200 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="jd">
            Job description
          </label>
          <textarea
            id="jd"
            rows={8}
            disabled={isBusy}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {jobDescription.trim().length < 30
              ? `${30 - jobDescription.trim().length} more characters needed`
              : "Looks good"}
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isBusy}
          className="rounded-md bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-neutral-800 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isBusy && (
            <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {stage === "uploading" && "Uploading resume..."}
          {stage === "analyzing" && "Analyzing against job description..."}
          {stage === "idle" && "Analyze my resume"}
        </button>
      </form>
    </div>
  );
}

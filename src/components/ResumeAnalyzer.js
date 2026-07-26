"use client";

import { useState } from "react";

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

  const isBusy = stage !== "idle";

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
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm border border-neutral-300 rounded-md px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-neutral-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="jd">
            Job description
          </label>
          <textarea
            id="jd"
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isBusy}
          className="rounded-md bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-neutral-800 disabled:opacity-50"
        >
          {stage === "uploading" && "Uploading resume..."}
          {stage === "analyzing" && "Analyzing against job description..."}
          {stage === "idle" && "Analyze my resume"}
        </button>
      </form>

      {resume && (
        <div className="text-sm text-neutral-500">
          Uploaded:{" "}
          <span className="font-medium text-neutral-700">
            {resume.filename}
          </span>{" "}
          —{" "}
          <a
            href={resume.fileUrl}
            className="underline hover:text-neutral-900"
            download
          >
            download original
          </a>
        </div>
      )}

      {analysis && <AnalysisResults analysis={analysis} />}
    </div>
  );
}

function AnalysisResults({ analysis }) {
  return (
    <div className="border border-neutral-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-semibold">{analysis.matchScore}</div>
        <div className="text-sm text-neutral-500">
          / 100 match score
          <p className="mt-1">{analysis.summary}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-green-700">
            Matched skills
          </h3>
          <ul className="space-y-1">
            {analysis.matchedSkills?.map((skill, i) => (
              <li key={i} className="text-sm text-neutral-700">
                ✓ {skill}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-red-700">
            Missing skills
          </h3>
          <ul className="space-y-1">
            {analysis.missingSkills?.map((skill, i) => (
              <li key={i} className="text-sm text-neutral-700">
                ✗ {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
        <ul className="space-y-2 list-disc list-inside">
          {analysis.suggestions?.map((suggestion, i) => (
            <li key={i} className="text-sm text-neutral-700">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

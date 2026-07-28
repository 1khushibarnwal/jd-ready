"use client";

import { useState } from "react";

export default function CoverLetterGenerator({ resumes, initialLetters }) {
  const [resumeId, setResumeId] = useState(resumes[0]?._id || "");
  const [jobDescription, setJobDescription] = useState("");
  const [letter, setLetter] = useState(null);
  const [letters, setLetters] = useState(initialLetters);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setError("");
    setCopied(false);

    if (!resumeId) {
      setError("Please select a resume first");
      return;
    }
    if (jobDescription.trim().length < 30) {
      setError("Paste a fuller job description (at least 30 characters)");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobDescription }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setGenerating(false);
        return;
      }

      setLetter(data.coverLetter);
      setLetters((prev) => [data.coverLetter, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownload(id) {
    setDownloadingId(id);
    try {
      const res = await fetch(`/api/cover-letters/${id}/download`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover_letter_JDReady.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Couldn't generate the PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleCopy(content) {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
        You need to analyze a resume first before generating a cover letter —
        head to{" "}
        <a href="/dashboard" className="underline hover:text-neutral-900">
          Analyze resume
        </a>{" "}
        and upload one.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="resume-select"
          >
            Choose a resume
          </label>
          <select
            id="resume-select"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.filename}
              </option>
            ))}
          </select>
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
          disabled={generating}
          className="rounded-md bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-neutral-800 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {generating && (
            <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {generating
            ? "Writing your cover letter..."
            : "Generate cover letter"}
        </button>
      </form>

      {letter && (
        <div className="border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
              Generated letter
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopy(letter.content)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline"
              >
                {copied ? "Copied!" : "Copy text"}
              </button>
              <button
                onClick={() => handleDownload(letter._id)}
                disabled={downloadingId === letter._id}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline disabled:opacity-50"
              >
                {downloadingId === letter._id
                  ? "Generating..."
                  : "Download PDF"}
              </button>
            </div>
          </div>
          <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {letter.content}
          </p>
        </div>
      )}

      {letters.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Past cover letters
          </h3>
          <ul className="space-y-2">
            {letters.map((l) => (
              <li
                key={l._id}
                className="flex items-center justify-between gap-4 border border-neutral-200 rounded-lg px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {l.resume?.filename || "Deleted resume"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(l.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setLetter(l)}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(l._id)}
                    disabled={downloadingId === l._id}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline disabled:opacity-50"
                  >
                    {downloadingId === l._id ? "..." : "Download"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

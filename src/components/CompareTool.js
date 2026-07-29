"use client";

import { useState } from "react";
import Link from "next/link";

const emptyJD = () => ({ label: "", text: "" });

function scoreColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function CompareTool({ resumes }) {
  const [resumeId, setResumeId] = useState(resumes[0]?._id || "");
  const [jds, setJds] = useState([emptyJD(), emptyJD()]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [comparing, setComparing] = useState(false);

  function updateJD(index, field, value) {
    setJds((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addJD() {
    if (jds.length >= 5) return;
    setJds((prev) => [...prev, emptyJD()]);
  }

  function removeJD(index) {
    if (jds.length <= 2) return; // need at least 2 to compare
    setJds((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCompare(e) {
    e.preventDefault();
    setError("");
    setResults(null);

    if (!resumeId) {
      setError("Please select a resume first");
      return;
    }

    const shortIndex = jds.findIndex((jd) => jd.text.trim().length < 30);
    if (shortIndex !== -1) {
      setError(
        `Job description #${shortIndex + 1} needs at least 30 characters`,
      );
      return;
    }

    setComparing(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobDescriptions: jds }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setComparing(false);
        return;
      }

      setResults(data.results);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setComparing(false);
    }
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
        You need to analyze a resume first — head to{" "}
        <Link href="/dashboard" className="underline hover:text-neutral-900">
          Analyze resume
        </Link>{" "}
        and upload one.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleCompare} className="space-y-6">
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

        <div className="space-y-4">
          {jds.map((jd, i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  value={jd.label}
                  onChange={(e) => updateJD(i, "label", e.target.value)}
                  placeholder={`Label (optional) — e.g. "Google - SWE"`}
                  className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                {jds.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeJD(i)}
                    className="text-xs text-red-600 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                rows={6}
                value={jd.text}
                onChange={(e) => updateJD(i, "text", e.target.value)}
                placeholder={`Paste job description #${i + 1} here...`}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          {jds.length < 5 ? (
            <button
              type="button"
              onClick={addJD}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline"
            >
              + Add another job description
            </button>
          ) : (
            <span className="text-xs text-neutral-400">Up to 5 at a time</span>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={comparing}
          className="rounded-md bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-neutral-800 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {comparing && (
            <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {comparing ? "Comparing..." : "Compare"}
        </button>
      </form>

      {results && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Results — best match first
          </h3>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li
                key={r._id || i}
                className="flex items-center justify-between gap-4 border border-neutral-200 rounded-lg px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {r.label}
                  </p>
                  {r.error ? (
                    <p className="text-xs text-red-600">{r.error}</p>
                  ) : (
                    <p className="text-xs text-neutral-500 truncate">
                      {r.summary}
                    </p>
                  )}
                </div>
                {r.error ? (
                  <span className="text-xs text-neutral-400 shrink-0">—</span>
                ) : (
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-lg font-semibold ${scoreColor(r.matchScore)}`}
                    >
                      {r.matchScore}
                    </span>
                    <Link
                      href={`/history/${r._id}`}
                      className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline"
                    >
                      View
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

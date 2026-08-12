"use client";

import { useState } from "react";
import FormattedText from "@/components/FormattedText";

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default function AnalysisResults({ analysis, resumeId }) {
  // Which suggestion indices the user has opted into applying. Nothing is
  // pre-checked — every change requires an explicit, individual opt-in.
  const [approved, setApproved] = useState({}); // { [index]: true }
  // The exact wording to send per suggestion, seeded from the original
  // suggestion text but fully editable — the user controls the final phrasing.
  const [editedText, setEditedText] = useState({}); // { [index]: string }
  // Where the AI suggests placing each suggestion, once drafted.
  const [placementHint, setPlacementHint] = useState({}); // { [index]: string }
  // Per-suggestion "drafting wording..." loading state.
  const [drafting, setDrafting] = useState({}); // { [index]: true }
  const [draftError, setDraftError] = useState({}); // { [index]: string }

  const [tweaking, setTweaking] = useState(false);
  const [tweakError, setTweakError] = useState("");
  const [tweakedResumeText, setTweakedResumeText] = useState("");
  const [copied, setCopied] = useState(false);

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const suggestions = analysis.suggestions || [];
  const approvedCount = Object.values(approved).filter(Boolean).length;

  function toggleApproved(i) {
    setApproved((prev) => ({ ...prev, [i]: !prev[i] }));
    // Seed the editable text the first time a suggestion is checked, so the
    // textarea always starts from what was actually suggested.
    setEditedText((prev) =>
      prev[i] !== undefined ? prev : { ...prev, [i]: suggestions[i] },
    );
  }

  function updateEditedText(i, value) {
    setEditedText((prev) => ({ ...prev, [i]: value }));
  }

  // Asks the AI to draft concrete, grounded wording + where to place it for
  // suggestion `i`. Auto-checks the suggestion (so the drafted text is
  // visible in its textarea) but never applies anything on its own — the
  // user still has to review/edit and hit Apply.
  async function handleDraftWording(i) {
    if (!resumeId) return;

    setDraftError((prev) => ({ ...prev, [i]: "" }));
    setDrafting((prev) => ({ ...prev, [i]: true }));

    setApproved((prev) => (prev[i] ? prev : { ...prev, [i]: true }));

    try {
      const res = await fetch("/api/resumes/suggest-wording", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          jobDescription: analysis.jobDescription,
          suggestion: suggestions[i],
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setDraftError((prev) => ({
          ...prev,
          [i]: data.error || "Couldn't draft wording for this.",
        }));
        return;
      }

      setEditedText((prev) => ({ ...prev, [i]: data.wording }));
      setPlacementHint((prev) => ({ ...prev, [i]: data.placement }));
    } catch (err) {
      console.error(err);
      setDraftError((prev) => ({
        ...prev,
        [i]: "Something went wrong. Please try again.",
      }));
    } finally {
      setDrafting((prev) => ({ ...prev, [i]: false }));
    }
  }

  async function handleApply() {
    setTweakError("");
    setTweakedResumeText("");

    const finalEdits = Object.keys(approved)
      .filter((i) => approved[i])
      .map((i) => (editedText[i] ?? suggestions[i]).trim())
      .filter(Boolean);

    if (finalEdits.length === 0) {
      setTweakError("Select at least one suggestion to apply.");
      return;
    }

    setTweaking(true);
    try {
      const res = await fetch("/api/resumes/tweak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, edits: finalEdits }),
      });
      const data = await res.json();

      if (!res.ok) {
        setTweakError(data.error || "Couldn't apply those changes.");
        return;
      }

      setTweakedResumeText(data.tweakedResumeText);
    } catch (err) {
      console.error(err);
      setTweakError("Something went wrong. Please try again.");
    } finally {
      setTweaking(false);
    }
  }

  function handleDownloadText() {
    const blob = new Blob([tweakedResumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tweaked-resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleDownloadPdf() {
    setDownloadError("");
    setDownloadingPdf(true);
    try {
      const res = await fetch("/api/resumes/tweak/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweakedResumeText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDownloadError(data.error || "Couldn't generate the PDF.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tweaked-resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setDownloadError("Something went wrong generating the PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(tweakedResumeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail silently (permissions, insecure context) —
      // the text is still visible and selectable in the preview either way.
    }
  }

  return (
    <div className="border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div
          className={`font-mono text-4xl font-semibold ${scoreColor(analysis.matchScore)}`}
        >
          {analysis.matchScore}
        </div>
        <div className="text-sm text-ink-secondary">
          / 100 match score
          <p className="mt-1">
            <FormattedText text={analysis.summary} />
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-success">
            Matched skills
          </h3>
          {analysis.matchedSkills?.length ? (
            <ul className="space-y-1">
              {analysis.matchedSkills.map((skill, i) => (
                <li key={i} className="text-sm text-ink">
                  ✓ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-secondary">None identified</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-danger">
            Missing skills
          </h3>
          {analysis.missingSkills?.length ? (
            <ul className="space-y-1">
              {analysis.missingSkills.map((skill, i) => (
                <li key={i} className="text-sm text-ink">
                  ✗ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-secondary">None — great match!</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1">Suggestions</h3>
        {resumeId && suggestions.length > 0 && (
          <p className="text-xs text-ink-secondary mb-3">
            Check the ones you want, edit the wording if you&apos;d like, then
            apply. Tap 💡 if you want AI to draft the exact line and tell you
            where it goes. Nothing gets changed on your resume unless you
            approve it here.
          </p>
        )}

        {suggestions.length ? (
          <ul className="space-y-3">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-ink">
                {resumeId ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <label className="flex items-start gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={!!approved[i]}
                          onChange={() => toggleApproved(i)}
                          className="mt-0.5 shrink-0"
                        />
                        <span>
                          <FormattedText text={suggestion} />
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDraftWording(i)}
                        disabled={!!drafting[i]}
                        title="Have AI draft this line and suggest where to add it"
                        className="shrink-0 text-base leading-none px-1.5 py-1 rounded hover:bg-border disabled:opacity-50"
                      >
                        {drafting[i] ? "⏳" : "💡"}
                      </button>
                    </div>

                    {approved[i] && (
                      <div className="ml-6">
                        <textarea
                          rows={2}
                          value={editedText[i] ?? suggestion}
                          onChange={(e) => updateEditedText(i, e.target.value)}
                          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                        />
                        <p className="text-xs text-ink-secondary mt-1">
                          This exact wording is what will be applied — edit it
                          however you&apos;d like.
                        </p>
                        {placementHint[i] && (
                          <p className="text-xs text-ink-secondary mt-1">
                            💡 <FormattedText text={placementHint[i]} />
                          </p>
                        )}
                        {draftError[i] && (
                          <p className="text-xs text-danger mt-1">
                            {draftError[i]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    • <FormattedText text={suggestion} />
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-secondary">No specific suggestions.</p>
        )}

        {resumeId && suggestions.length > 0 && (
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={handleApply}
              disabled={approvedCount === 0 || tweaking}
              className="rounded-md bg-ink text-surface text-sm font-medium px-5 py-2.5 hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {tweaking && (
                <span className="h-3.5 w-3.5 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
              )}
              {tweaking
                ? "Applying your approved changes..."
                : approvedCount > 0
                  ? `Apply ${approvedCount} approved change${approvedCount === 1 ? "" : "s"} to my resume`
                  : "Apply approved changes to my resume"}
            </button>

            {tweakError && <p className="text-sm text-danger">{tweakError}</p>}
          </div>
        )}
      </div>

      {tweakedResumeText && (
        <div className="border-t border-border pt-6 space-y-3">
          <h3 className="text-sm font-semibold">Your tweaked resume</h3>
          <p className="text-xs text-ink-secondary">
            Only the changes you approved above were applied — everything else
            from your original resume was left untouched. The PDF download uses
            JDReady&apos;s clean template (we can&apos;t safely edit your
            original file&apos;s exact font/layout in place), so double-check
            formatting before sending it out.
          </p>
          <pre className="whitespace-pre-wrap text-sm text-ink bg-background border border-border rounded-md p-4 max-h-96 overflow-y-auto">
            {tweakedResumeText}
          </pre>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="rounded-md bg-ink text-surface text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {downloadingPdf && (
                <span className="h-3.5 w-3.5 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
              )}
              {downloadingPdf ? "Generating PDF..." : "Download as PDF"}
            </button>
            <button
              type="button"
              onClick={handleDownloadText}
              className="text-sm font-medium text-ink-secondary hover:text-ink underline"
            >
              Download as .txt
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="text-sm font-medium text-ink-secondary hover:text-ink underline"
            >
              {copied ? "Copied!" : "Copy text"}
            </button>
          </div>
          {downloadError && (
            <p className="text-sm text-danger">{downloadError}</p>
          )}
        </div>
      )}
    </div>
  );
}

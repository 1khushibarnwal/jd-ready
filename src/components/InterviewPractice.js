"use client";

import { useState } from "react";
import FormattedText from "@/components/FormattedText";
import InterviewScoreChart from "@/components/InterviewScoreChart";
import { useUndoableDelete } from "@/hooks/useUndoableDelete";
import DeleteRowAction from "@/components/DeleteRowAction";
import UndoToastStack from "@/components/UndoToastStack";

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default function InterviewPractice({ resumes, initialSessions }) {
  const [resumeId, setResumeId] = useState(resumes[0]?._id || "");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  const [pastSessions, setPastSessions] = useState(initialSessions);
  const {
    confirmingId: confirmingSessionId,
    pendingDeletes: pendingSessionDeletes,
    askConfirm: askConfirmSessionDelete,
    cancelConfirm: cancelConfirmSessionDelete,
    confirmDelete: confirmSessionDelete,
    undo: undoSessionDelete,
    dismissToast: dismissSessionToast,
  } = useUndoableDelete({
    items: pastSessions,
    setItems: setPastSessions,
    deleteUrl: (id) => `/api/interview/${id}`,
  });
  const [stage, setStage] = useState("setup"); // setup | session | round-prompt | summary
  const [activeSession, setActiveSession] = useState(null); // { _id, questions, answers }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [round, setRound] = useState(1);
  const [continuing, setContinuing] = useState(false);
  const [continueError, setContinueError] = useState("");

  async function handleStart(e) {
    e.preventDefault();
    setError("");

    if (!resumeId) {
      setError("Please select a resume first");
      return;
    }
    if (jobDescription.trim().length < 30) {
      setError("Paste a fuller job description (at least 30 characters)");
      return;
    }

    setStarting(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobDescription }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStarting(false);
        return;
      }

      setActiveSession(data.session);
      setCurrentIndex(0);
      setAnswerText("");
      setCurrentFeedback(null);
      setRound(1);
      setStage("session");
      setPastSessions((prev) => [data.session, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setStarting(false);
    }
  }

  async function handleSubmitAnswer() {
    if (answerText.trim().length < 10) {
      setError("Write a bit more before submitting (at least 10 characters)");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/interview/${activeSession._id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIndex: currentIndex, answerText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      setCurrentFeedback(data.feedback);

      // This was the bug: without this, activeSession.answers stays the empty
      // array from session creation, so the summary screen thinks nothing was
      // ever answered even though every submission succeeded.
      setActiveSession((prev) => {
        const nextAnswers = [...(prev.answers || [])];
        const existingIndex = nextAnswers.findIndex(
          (a) => a.questionIndex === currentIndex,
        );
        if (existingIndex !== -1) {
          nextAnswers[existingIndex] = data.feedback;
        } else {
          nextAnswers.push(data.feedback);
        }
        return { ...prev, answers: nextAnswers };
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    const isLastOfKnownBatch =
      currentIndex === activeSession.questions.length - 1;
    if (isLastOfKnownBatch) {
      setStage("round-prompt");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setAnswerText("");
    setCurrentFeedback(null);
  }

  async function handleContinueRound() {
    setContinuing(true);
    setContinueError("");

    try {
      const res = await fetch(`/api/interview/${activeSession._id}/continue`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setContinueError(data.error || "Something went wrong");
        setContinuing(false);
        return;
      }

      const startIndex = data.startIndex;
      setActiveSession((prev) => ({
        ...prev,
        questions: [...prev.questions, ...data.newQuestions],
      }));
      setRound((r) => r + 1);
      setCurrentIndex(startIndex);
      setAnswerText("");
      setCurrentFeedback(null);
      setStage("session");
    } catch (err) {
      console.error(err);
      setContinueError("Something went wrong. Please try again.");
    } finally {
      setContinuing(false);
    }
  }

  function handleDeclineRound() {
    setStage("summary");
  }

  function handleReset() {
    setStage("setup");
    setActiveSession(null);
    setCurrentIndex(0);
    setAnswerText("");
    setCurrentFeedback(null);
    setJobDescription("");
    setRound(1);
    setContinueError("");
  }

  async function viewPastSession(id) {
    setError("");
    try {
      const res = await fetch(`/api/interview/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't load that session");
        return;
      }
      setActiveSession(data.session);
      setStage("summary");
    } catch (err) {
      console.error(err);
      setError("Couldn't load that session");
    }
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-ink-secondary">
        You need to analyze a resume first — head to{" "}
        <a href="/dashboard" className="underline hover:text-ink">
          Analyze resume
        </a>{" "}
        and upload one.
      </div>
    );
  }

  // --- Session stage: one question at a time ---
  if (stage === "session" && activeSession) {
    const question = activeSession.questions[currentIndex];
    const total = activeSession.questions.length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm text-ink-secondary">
          <span>
            Question {currentIndex + 1} of {total} · Round {round}
          </span>
          <span className="uppercase text-xs font-semibold tracking-wide">
            {question.type}
          </span>
        </div>

        <div className="border border-border rounded-lg p-6">
          <p className="font-medium text-ink mb-4">{question.text}</p>

          <textarea
            rows={6}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={!!currentFeedback}
            placeholder="Type your answer as you would say it out loud..."
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink disabled:opacity-60"
          />

          {error && <p className="text-sm text-danger mt-2">{error}</p>}

          {!currentFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting}
              className="mt-4 rounded-md bg-ink text-surface text-sm font-medium px-5 py-2.5 hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting && (
                <span className="h-3.5 w-3.5 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
              )}
              {submitting ? "Evaluating your answer..." : "Submit answer"}
            </button>
          ) : (
            <div className="mt-5 pt-5 border-t border-border space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-2xl font-semibold ${scoreColor(currentFeedback.score)}`}
                >
                  {currentFeedback.score}
                </span>
                <span className="text-sm text-ink-secondary">/ 100</span>
              </div>

              {currentFeedback.strengths?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-success mb-1.5">
                    What worked
                  </p>
                  <ul className="space-y-1">
                    {currentFeedback.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-ink">
                        ✓ <FormattedText text={s} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentFeedback.improvements?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-warning mb-1.5">
                    Could improve
                  </p>
                  <ul className="space-y-1">
                    {currentFeedback.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-ink">
                        → <FormattedText text={s} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentFeedback.modelAnswer && (
                <div>
                  <p className="text-sm font-semibold text-ink mb-1.5">
                    Example strong answer
                  </p>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    <FormattedText text={currentFeedback.modelAnswer} />
                  </p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="rounded-md bg-ink text-surface text-sm font-medium px-5 py-2.5 hover:opacity-90"
              >
                {currentIndex === activeSession.questions.length - 1
                  ? "Continue"
                  : "Next question"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Round prompt: keep going or wrap up? ---
  if (stage === "round-prompt" && activeSession) {
    return (
      <div className="border border-border rounded-lg p-8 text-center space-y-4">
        <p className="font-display text-xl font-semibold text-ink">
          Nice work finishing round {round}. Want to go for round {round + 1}?
        </p>
        <p className="text-sm text-ink-secondary max-w-md mx-auto">
          You&apos;ll get 6 more questions on the same resume and job
          description — different questions than what you&apos;ve already
          answered.
        </p>

        {continueError && (
          <p className="text-sm text-danger">{continueError}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleContinueRound}
            disabled={continuing}
            className="w-full sm:w-auto rounded-md bg-ink text-surface text-sm font-medium px-6 py-2.5 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {continuing && (
              <span className="h-3.5 w-3.5 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
            )}
            {continuing
              ? "Preparing round " + (round + 1) + "..."
              : "Yes, round " + (round + 1)}
          </button>
          <button
            onClick={handleDeclineRound}
            disabled={continuing}
            className="w-full sm:w-auto rounded-md border border-border text-ink text-sm font-medium px-6 py-2.5 hover:bg-background disabled:opacity-50"
          >
            No, show my summary
          </button>
        </div>
      </div>
    );
  }

  // --- Summary stage ---
  if (stage === "summary" && activeSession) {
    const answeredCount = activeSession.answers?.length || 0;
    const avgScore = answeredCount
      ? Math.round(
          activeSession.answers.reduce((sum, a) => sum + (a.score || 0), 0) /
            answeredCount,
        )
      : null;

    // Pull together every improvement note across all answered questions,
    // deduplicated, as a concrete "what to work on" list next to the score chart.
    const focusAreas = Array.from(
      new Set(
        (activeSession.answers || []).flatMap((a) => a.improvements || []),
      ),
    ).slice(0, 6);

    return (
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-secondary">
              Session summary
            </h3>
            <button
              onClick={handleReset}
              className="text-sm font-medium text-ink underline"
            >
              Start new session
            </button>
          </div>

          {avgScore !== null ? (
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <InterviewScoreChart
                score={avgScore}
                answeredCount={answeredCount}
              />

              {focusAreas.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-ink mb-2">
                    Focus areas
                  </p>
                  <ul className="space-y-1.5">
                    {focusAreas.map((area, i) => (
                      <li key={i} className="text-sm text-ink-secondary">
                        → <FormattedText text={area} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-secondary">
              No questions were answered in this session.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {activeSession.questions.map((q, i) => {
            const answer = activeSession.answers?.find(
              (a) => a.questionIndex === i,
            );
            return (
              <div key={i} className="border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-ink">{q.text}</p>
                  {answer && (
                    <span
                      className={`font-mono text-sm font-semibold shrink-0 ml-4 ${scoreColor(answer.score)}`}
                    >
                      {answer.score}
                    </span>
                  )}
                </div>
                {answer ? (
                  <p className="text-sm text-ink-secondary whitespace-pre-wrap">
                    {answer.answerText}
                  </p>
                ) : (
                  <p className="text-sm text-ink-secondary italic">
                    Not answered
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Setup stage ---
  return (
    <div className="space-y-10">
      <form onSubmit={handleStart} className="space-y-4">
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
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
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
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={starting}
          className="rounded-md bg-ink text-surface text-sm font-medium px-5 py-2.5 hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {starting && (
            <span className="h-3.5 w-3.5 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
          )}
          {starting ? "Preparing your questions..." : "Start mock interview"}
        </button>
      </form>

      {(pastSessions.length > 0 || pendingSessionDeletes.length > 0) && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-secondary mb-3">
            Past sessions
          </h3>
          <ul className="space-y-2">
            {pastSessions.map((s) => (
              <li
                key={s._id}
                className="flex items-center gap-3 border border-border rounded-lg px-4 py-3"
              >
                <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {s.resume?.filename || "Deleted resume"}
                    </p>
                    <p className="text-xs text-ink-secondary">
                      {new Date(s.createdAt).toLocaleString()} ·{" "}
                      {s.questions?.length || 0} questions
                    </p>
                  </div>
                  <button
                    onClick={() => viewPastSession(s._id)}
                    className="text-xs font-medium text-ink-secondary hover:text-ink underline shrink-0"
                  >
                    View
                  </button>
                </div>

                <DeleteRowAction
                  isConfirming={confirmingSessionId === s._id}
                  onAskConfirm={() => askConfirmSessionDelete(s._id)}
                  onConfirm={() => confirmSessionDelete(s)}
                  onCancel={cancelConfirmSessionDelete}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <UndoToastStack
        pendingDeletes={pendingSessionDeletes}
        onUndo={undoSessionDelete}
        onDismiss={dismissSessionToast}
        message="Session deleted"
      />
    </div>
  );
}

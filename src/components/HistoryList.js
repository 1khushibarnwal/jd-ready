"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Trash2, X } from "lucide-react";

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default function HistoryList({ initialAnalyses }) {
  const [items, setItems] = useState(initialAnalyses);
  const [confirmingId, setConfirmingId] = useState(null);
  const [pendingDeletes, setPendingDeletes] = useState([]); // [{ id, item, index }]
  const timeoutsRef = useRef({}); // id -> timeoutId

  function handleConfirmDelete(item) {
    const index = items.findIndex((i) => i._id === item._id);

    // Optimistically remove from view right away.
    setItems((prev) => prev.filter((i) => i._id !== item._id));
    setConfirmingId(null);
    setPendingDeletes((prev) => [...prev, { id: item._id, item, index }]);

    // The actual server delete only happens if Undo isn't clicked within 5s.
    const timeoutId = setTimeout(async () => {
      try {
        await fetch(`/api/history/${item._id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete analysis:", err);
      }
      setPendingDeletes((prev) => prev.filter((p) => p.id !== item._id));
      delete timeoutsRef.current[item._id];
    }, 5000);

    timeoutsRef.current[item._id] = timeoutId;
  }

  function handleUndo(id) {
    const pending = pendingDeletes.find((p) => p.id === id);
    if (!pending) return;

    clearTimeout(timeoutsRef.current[id]);
    delete timeoutsRef.current[id];

    // Reinsert at its original position so the list order stays sensible.
    setItems((prev) => {
      const next = [...prev];
      const insertAt = Math.min(pending.index, next.length);
      next.splice(insertAt, 0, pending.item);
      return next;
    });
    setPendingDeletes((prev) => prev.filter((p) => p.id !== id));
  }

  function handleDismissToast(id) {
    // Just hides the toast early — the scheduled deletion still happens on time.
    setPendingDeletes((prev) => prev.filter((p) => p.id !== id));
  }

  if (items.length === 0 && pendingDeletes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-ink-secondary">
        No analyses yet.{" "}
        <Link href="/dashboard" className="underline hover:text-ink">
          Run your first one
        </Link>
        .
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {items.map((analysis) => {
          const isConfirming = confirmingId === analysis._id;
          return (
            <li
              key={analysis._id}
              className="flex items-center gap-3 border border-border rounded-lg px-4 py-3"
            >
              <Link
                href={`/history/${analysis._id}`}
                className="flex-1 min-w-0 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {analysis.label ||
                      analysis.resume?.filename ||
                      "Deleted resume"}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {new Date(analysis.createdAt).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`font-mono text-lg font-semibold shrink-0 ${scoreColor(analysis.matchScore)}`}
                >
                  {analysis.matchScore}
                </div>
              </Link>

              {isConfirming ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-ink-secondary">Delete?</span>
                  <button
                    onClick={() => handleConfirmDelete(analysis)}
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="text-xs font-medium text-ink-secondary hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingId(analysis._id)}
                  className="shrink-0 rounded-md p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                  aria-label="Delete analysis"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Undo toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {pendingDeletes.map((pending) => (
          <div
            key={pending.id}
            className="flex items-center gap-3 bg-ink text-surface rounded-md shadow-lg px-4 py-3 text-sm"
          >
            <span>Analysis deleted</span>
            <button
              onClick={() => handleUndo(pending.id)}
              className="font-medium underline hover:opacity-80"
            >
              Undo
            </button>
            <button
              onClick={() => handleDismissToast(pending.id)}
              className="text-surface/70 hover:text-surface"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

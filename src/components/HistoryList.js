"use client";

import { useState } from "react";
import Link from "next/link";
import { useUndoableDelete } from "@/hooks/useUndoableDelete";
import DeleteRowAction from "@/components/DeleteRowAction";
import UndoToastStack from "@/components/UndoToastStack";

function scoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export default function HistoryList({ initialAnalyses }) {
  const [items, setItems] = useState(initialAnalyses);
  const {
    confirmingId,
    pendingDeletes,
    askConfirm,
    cancelConfirm,
    confirmDelete,
    undo,
    dismissToast,
  } = useUndoableDelete({
    items,
    setItems,
    deleteUrl: (id) => `/api/history/${id}`,
  });

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
        {items.map((analysis) => (
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

            <DeleteRowAction
              isConfirming={confirmingId === analysis._id}
              onAskConfirm={() => askConfirm(analysis._id)}
              onConfirm={() => confirmDelete(analysis)}
              onCancel={cancelConfirm}
            />
          </li>
        ))}
      </ul>

      <UndoToastStack
        pendingDeletes={pendingDeletes}
        onUndo={undo}
        onDismiss={dismissToast}
        message="Analysis deleted"
      />
    </>
  );
}

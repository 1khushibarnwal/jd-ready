"use client";

import { X } from "lucide-react";

export default function UndoToastStack({
  pendingDeletes,
  onUndo,
  onDismiss,
  message = "Item deleted",
}) {
  if (pendingDeletes.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 space-y-2">
      {pendingDeletes.map((pending) => (
        <div
          key={pending.id}
          className="flex items-center gap-3 bg-ink text-surface rounded-md shadow-lg px-4 py-3 text-sm w-full sm:w-auto"
        >
          <span className="min-w-0 flex-1">{message}</span>

          <button
            onClick={() => onUndo(pending.id)}
            className="font-medium underline hover:opacity-80 shrink-0"
          >
            Undo
          </button>

          <button
            onClick={() => onDismiss(pending.id)}
            className="text-surface/70 hover:text-surface shrink-0"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

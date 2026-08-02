"use client";

import { Trash2 } from "lucide-react";

export default function DeleteRowAction({
  isConfirming,
  onAskConfirm,
  onConfirm,
  onCancel,
}) {
  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-ink-secondary">Delete?</span>
        <button
          onClick={onConfirm}
          className="text-xs font-medium text-danger hover:underline"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="text-xs font-medium text-ink-secondary hover:text-ink"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onAskConfirm}
      className="shrink-0 rounded-md p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 transition-colors"
      aria-label="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}

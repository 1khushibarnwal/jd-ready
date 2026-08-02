"use client";

import { useRef, useState } from "react";

/**
 * Shared "delete with 5s undo" behavior for any list.
 *
 * The caller owns the list state (items/setItems) — this hook just manages
 * which item is mid-confirmation and which are pending deletion, and fires
 * the actual DELETE request only after the undo window expires.
 *
 * @param {object} params
 * @param {any[]} params.items
 * @param {(updater: any[] | ((prev:any[]) => any[])) => void} params.setItems
 * @param {(id: string) => string} params.deleteUrl - builds the DELETE endpoint for an id
 * @param {(id: string) => string} params.getId - extracts an id from an item (defaults to item._id)
 */
export function useUndoableDelete({
  items,
  setItems,
  deleteUrl,
  getId = (item) => item._id,
}) {
  const [confirmingId, setConfirmingId] = useState(null);
  const [pendingDeletes, setPendingDeletes] = useState([]); // [{ id, item, index }]
  const timeoutsRef = useRef({}); // id -> timeoutId

  function askConfirm(id) {
    setConfirmingId(id);
  }

  function cancelConfirm() {
    setConfirmingId(null);
  }

  function confirmDelete(item) {
    const id = getId(item);
    const index = items.findIndex((i) => getId(i) === id);

    // Optimistically remove from view right away.
    setItems((prev) => prev.filter((i) => getId(i) !== id));
    setConfirmingId(null);
    setPendingDeletes((prev) => [...prev, { id, item, index }]);

    // The actual server delete only happens if Undo isn't clicked within 5s.
    const timeoutId = setTimeout(async () => {
      try {
        await fetch(deleteUrl(id), { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
      setPendingDeletes((prev) => prev.filter((p) => p.id !== id));
      delete timeoutsRef.current[id];
    }, 5000);

    timeoutsRef.current[id] = timeoutId;
  }

  function undo(id) {
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

  function dismissToast(id) {
    // Just hides the toast early — the scheduled deletion still happens on time.
    setPendingDeletes((prev) => prev.filter((p) => p.id !== id));
  }

  return {
    confirmingId,
    pendingDeletes,
    askConfirm,
    cancelConfirm,
    confirmDelete,
    undo,
    dismissToast,
  };
}

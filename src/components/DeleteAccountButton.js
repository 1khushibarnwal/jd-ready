"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setDeleting(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-md border border-danger text-danger text-sm font-medium px-4 py-2 hover:bg-danger/10 transition-colors"
      >
        Delete my account
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ink">
        Are you sure? This permanently deletes everything — there&apos;s no
        undo.
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full sm:w-auto rounded-md bg-danger text-surface text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Yes, delete everything"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="text-sm font-medium text-ink-secondary hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

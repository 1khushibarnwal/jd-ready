"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditProfileForm({ initialName, initialEmail }) {
  const router = useRouter();
  const { update } = useSession();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  function startEditing() {
    setName(initialName);
    setEmail(initialEmail);
    setError("");
    setSavedMessage("");
    setEditing(true);
  }

  function cancelEditing() {
    setError("");
    setEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSaving(false);
        return;
      }

      // Push the new name/email into the JWT-backed session immediately,
      // then refresh so any server components (e.g. the navbar) pick it up.
      await update({ name: data.user.name, email: data.user.email });
      router.refresh();

      setEditing(false);
      setSavedMessage("Profile updated");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-ink-secondary">Name</p>
          <p className="text-ink font-medium">{initialName}</p>
        </div>
        <div>
          <p className="text-ink-secondary">Email</p>
          <p className="text-ink font-medium">{initialEmail}</p>
        </div>
        {savedMessage && (
          <p className="text-sm text-green-600">{savedMessage}</p>
        )}
        <button
          onClick={startEditing}
          className="rounded-md border border-border text-ink text-sm font-medium px-4 py-2 hover:bg-background transition-colors"
        >
          Edit profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-ink-secondary mb-1">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-ink-secondary mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
        />
        <p className="mt-1 text-xs text-ink-secondary">
          This is also what you log in with — changing it takes effect right
          away.
        </p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-ink text-surface text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={cancelEditing}
          disabled={saving}
          className="text-sm font-medium text-ink-secondary hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

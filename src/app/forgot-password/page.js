"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Always show the same success state, regardless of whether the email
      // actually exists — matches the API's generic response.
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold mb-1 text-ink">
          Reset your password
        </h1>
        <p className="text-sm text-ink-secondary mb-6">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>

        {submitted ? (
          <p className="text-sm text-success bg-success/10 border border-success/30 rounded-md px-3 py-3">
            If an account exists for that email, we&apos;ve sent a password
            reset link. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-ink text-surface text-sm font-medium py-2 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-sm text-ink-secondary mt-6">
          <Link href="/login" className="text-ink font-medium underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

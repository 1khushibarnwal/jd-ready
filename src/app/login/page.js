"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get("justSignedUp");
  const passwordReset = searchParams.get("passwordReset");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold mb-1 text-ink">
          Welcome back
        </h1>
        <p className="text-sm text-ink-secondary mb-6">Log in to continue.</p>

        {justSignedUp && (
          <p className="text-sm text-success bg-success/10 border border-success/30 rounded-md px-3 py-2 mb-4">
            Account created — log in below.
          </p>
        )}

        {passwordReset && (
          <p className="text-sm text-success bg-success/10 border border-success/30 rounded-md px-3 py-2 mb-4">
            Password updated — log in with your new password.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-ink-secondary hover:text-ink underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-ink text-surface text-sm font-medium py-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-ink-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-ink font-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

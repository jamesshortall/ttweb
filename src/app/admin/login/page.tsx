"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/admin/ads";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setError(data.message ?? "Sign-in failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm items-center px-6">
      <form onSubmit={submit} className="w-full rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-navy-900">Advertising admin</h1>
        <p className="mt-1 text-sm text-navy-600">Sign in to view campaign analytics.</p>
        <label htmlFor="password" className="mt-6 block text-sm font-semibold text-navy-800">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-navy-200 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500"
          required
        />
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-navy-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

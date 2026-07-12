"use client";

import { useState } from "react";

export function BetaSignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      experience: form.get("experience"),
      homeBreak: form.get("homeBreak"),
    };

    try {
      const res = await fetch("/api/beta-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Signup failed");
      setStatus("success");
      setMessage("You're on the list! We'll email you when your beta spot opens.");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Name</span>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Experience</span>
          <select
            name="experience"
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Home break</span>
          <input
            name="homeBreak"
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            placeholder="e.g. Doran Beach"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-sand-400 px-4 py-3 font-semibold text-ocean-950 hover:bg-sand-300 disabled:opacity-60 transition-colors"
      >
        {status === "loading" ? "Joining…" : "Request Beta Access"}
      </button>
      {message && (
        <p
          className={`text-sm ${status === "success" ? "text-go" : "text-nogo"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}

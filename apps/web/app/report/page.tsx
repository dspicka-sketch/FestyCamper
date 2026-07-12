"use client";

import { useState } from "react";
import { SURF_LOCATIONS } from "@/lib/locations";

export default function CatchReportPage() {
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
      locationSlug: form.get("locationSlug"),
      reporterName: form.get("reporterName"),
      reporterEmail: form.get("reporterEmail") || undefined,
      tripDate: form.get("tripDate"),
      species: form.get("species"),
      fishCount: Number(form.get("fishCount")),
      baitUsed: form.get("baitUsed") || undefined,
      lureUsed: form.get("lureUsed") || undefined,
      surfScore: form.get("surfScore")
        ? Number(form.get("surfScore"))
        : undefined,
      notes: form.get("notes") || undefined,
    };

    try {
      const res = await fetch("/api/catch-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      setStatus("success");
      setMessage("Catch report saved. Thanks for helping improve SurfScore!");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-4xl text-sand-50">Post-Trip Catch Report</h1>
      <p className="mt-3 text-sand-300">
        Log what you caught to help calibrate SurfScore for the Sonoma Coast beta.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Beach</span>
          <select
            name="locationSlug"
            required
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
          >
            {SURF_LOCATIONS.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-sand-200">Your name</span>
            <input
              name="reporterName"
              required
              className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-sand-200">Email (optional)</span>
            <input
              name="reporterEmail"
              type="email"
              className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Trip date</span>
          <input
            name="tripDate"
            type="date"
            required
            defaultValue={today}
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-sand-200">Primary species</span>
            <input
              name="species"
              required
              placeholder="Surf perch"
              className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-sand-200">Fish count</span>
            <input
              name="fishCount"
              type="number"
              min={0}
              defaultValue={0}
              required
              className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-sand-200">Bait used</span>
            <input
              name="baitUsed"
              className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-sand-200">Lure used</span>
            <input
              name="lureUsed"
              className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">
            SurfScore that day (1–10, optional)
          </span>
          <input
            name="surfScore"
            type="number"
            min={1}
            max={10}
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-sand-200">Notes</span>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            placeholder="Tide, conditions, what worked…"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-ocean-500 px-4 py-3 font-semibold text-white hover:bg-ocean-400 disabled:opacity-60"
        >
          {status === "loading" ? "Saving…" : "Submit Catch Report"}
        </button>

        {message && (
          <p
            className={`text-sm ${status === "success" ? "text-go" : "text-nogo"}`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

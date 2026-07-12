"use client";

import { useCallback, useEffect, useState } from "react";

interface AdminData {
  signupStats: { total: number; pending: number; approved: number };
  signups: Array<{
    id: string;
    name: string;
    email: string;
    experience: string | null;
    status: string;
    createdAt: string;
  }>;
  reports: Array<{
    id: string;
    reporterName: string;
    species: string;
    fishCount: number;
    tripDate: string;
    location: { name: string };
  }>;
  locationCount: number;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (adminSecret: string) => {
    const res = await fetch(`/api/admin?secret=${encodeURIComponent(adminSecret)}`);
    if (!res.ok) {
      throw new Error("Invalid admin secret");
    }
    return res.json() as Promise<AdminData>;
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const result = await fetchData(secret);
      setData(result);
      setAuthenticated(true);
    } catch {
      setError("Invalid admin secret");
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin?secret=${encodeURIComponent(secret)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const refreshed = await fetchData(secret);
      setData(refreshed);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("surfscore_admin_secret");
    if (saved) {
      setSecret(saved);
      fetchData(saved)
        .then((result) => {
          setData(result);
          setAuthenticated(true);
        })
        .catch(() => sessionStorage.removeItem("surfscore_admin_secret"));
    }
  }, [fetchData]);

  function saveSecret() {
    sessionStorage.setItem("surfscore_admin_secret", secret);
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="font-display text-3xl text-sand-50">Admin Dashboard</h1>
        <p className="mt-2 text-sand-300">Enter your admin secret to continue.</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-lg border border-ocean-700 bg-ocean-900 px-3 py-2 text-sand-50"
            placeholder="Admin secret"
          />
          <button
            type="submit"
            onClick={saveSecret}
            className="w-full rounded-lg bg-ocean-500 py-2 font-semibold text-white"
          >
            Sign in
          </button>
          {error && <p className="text-sm text-nogo">{error}</p>}
        </form>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-sand-50">Admin Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Beta signups", value: data.signupStats.total },
          { label: "Pending", value: data.signupStats.pending },
          { label: "Approved", value: data.signupStats.approved },
          { label: "Beach locations", value: data.locationCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-ocean-800 bg-ocean-900/40 p-4"
          >
            <p className="text-sm text-ocean-400">{stat.label}</p>
            <p className="text-2xl font-bold text-sand-50">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-sand-100">Beta signups</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-700 text-ocean-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Experience</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.signups.map((s) => (
                <tr key={s.id} className="border-b border-ocean-800">
                  <td className="py-2 pr-4">{s.name}</td>
                  <td className="py-2 pr-4">{s.email}</td>
                  <td className="py-2 pr-4">{s.experience ?? "—"}</td>
                  <td className="py-2 pr-4">{s.status}</td>
                  <td className="py-2 space-x-2">
                    {s.status !== "APPROVED" && (
                      <button
                        onClick={() => updateStatus(s.id, "APPROVED")}
                        className="text-go hover:underline"
                      >
                        Approve
                      </button>
                    )}
                    {s.status !== "REJECTED" && (
                      <button
                        onClick={() => updateStatus(s.id, "REJECTED")}
                        className="text-nogo hover:underline"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-sand-100">Catch reports</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-700 text-ocean-400">
                <th className="py-2 pr-4">Angler</th>
                <th className="py-2 pr-4">Beach</th>
                <th className="py-2 pr-4">Species</th>
                <th className="py-2 pr-4">Count</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.reports.map((r) => (
                <tr key={r.id} className="border-b border-ocean-800">
                  <td className="py-2 pr-4">{r.reporterName}</td>
                  <td className="py-2 pr-4">{r.location.name}</td>
                  <td className="py-2 pr-4">{r.species}</td>
                  <td className="py-2 pr-4">{r.fishCount}</td>
                  <td className="py-2">
                    {new Date(r.tripDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

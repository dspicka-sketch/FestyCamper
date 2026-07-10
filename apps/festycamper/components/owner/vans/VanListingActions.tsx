'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { VanStatus } from '@prisma/client';
import Link from 'next/link';

type VanListingActionsProps = {
  vanId: string;
  status: VanStatus;
};

export function VanListingActions({ vanId, status }: VanListingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function toggleStatus(nextStatus: 'ACTIVE' | 'PAUSED') {
    setLoading(true);
    setError('');

    const res = await fetch(`/api/owner/vans/${vanId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? 'Unable to update listing status.');
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {status === 'ACTIVE' && (
          <Link
            href={`/vans/${vanId}`}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-sand-100 transition-colors hover:border-amber-glow/40 hover:bg-white/10"
          >
            View Public Listing
          </Link>
        )}
        <Link
          href={`/owner/vans/${vanId}/edit`}
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-sand-100 transition-colors hover:border-amber-glow/40 hover:bg-white/10"
        >
          Edit
        </Link>
        {status === 'ACTIVE' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => toggleStatus('PAUSED')}
            className="inline-flex items-center justify-center rounded-full border border-amber-glow/30 bg-amber-glow/10 px-4 py-2 text-xs font-semibold text-amber-glow transition-colors hover:bg-amber-glow/20 disabled:opacity-60"
          >
            Pause
          </button>
        )}
        {status === 'PAUSED' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => toggleStatus('ACTIVE')}
            className="inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-60"
          >
            Activate
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}

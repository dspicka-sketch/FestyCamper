'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BookingActionsProps = {
  bookingId: string;
  email: string;
  renterName: string;
  status: string;
};

export function BookingActions({ bookingId, email, renterName, status }: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'APPROVED' | 'DECLINED' | null>(null);
  const [error, setError] = useState('');

  async function updateStatus(nextStatus: 'APPROVED' | 'DECLINED') {
    setLoading(nextStatus);
    setError('');

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Unable to update booking.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update booking.');
    } finally {
      setLoading(null);
    }
  }

  const mutable = status === 'REQUESTED' || status === 'APPROVED';

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateStatus('APPROVED')}
          disabled={!mutable || loading !== null || status === 'APPROVED'}
          className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition-all duration-200 hover:bg-emerald-500/25 hover:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading === 'APPROVED' ? 'Approving…' : status === 'APPROVED' ? 'Approved' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => updateStatus('DECLINED')}
          disabled={!mutable || loading !== null}
          className="rounded-full bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30 transition-all duration-200 hover:bg-rose-500/25 hover:ring-rose-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading === 'DECLINED' ? 'Declining…' : 'Decline'}
        </button>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`FestyCamper booking — ${renterName}`)}`}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/10"
        >
          Contact
        </a>
      </div>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

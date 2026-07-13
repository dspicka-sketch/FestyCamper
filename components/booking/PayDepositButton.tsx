'use client';

import { useState } from 'react';

function formatApiError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'formErrors' in error) {
    return 'Invalid request. Please refresh and try again.';
  }
  return 'Unable to start checkout. Please try again.';
}

type PayDepositButtonProps = {
  bookingId: string;
  accessToken: string;
  disabled?: boolean;
};

export function PayDepositButton({ bookingId, accessToken, disabled }: PayDepositButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePayDeposit() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, accessToken }),
      });

      let data: { error?: unknown; url?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError('Unexpected server response. Please try again.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(formatApiError(data.error));
        setLoading(false);
        return;
      }

      if (!data.url) {
        setError('Checkout URL missing. Please try again.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Network error. Check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-amber-glow/25 bg-amber-glow/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
            Secure your spot with a deposit
          </h3>
          <p className="mt-1 text-sm text-sand-200/70">
            The owner approved your request. Pay a $250 refundable deposit to hold your dates.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePayDeposit}
          disabled={loading || disabled}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-glow/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Redirecting…' : 'Pay Deposit — $250'}
        </button>
      </div>
      {error && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}
      <p className="mt-4 text-xs text-sand-200/40">Test mode — use Stripe test card 4242 4242 4242 4242.</p>
    </div>
  );
}

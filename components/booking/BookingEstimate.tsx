'use client';

import type { BookingEstimate } from '@/lib/pricing';
import { formatMoney } from '@/lib/pricing';

type BookingEstimateProps = {
  estimate: BookingEstimate | null;
  loading?: boolean;
};

export function BookingEstimatePanel({ estimate, loading }: BookingEstimateProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-forest-950/50 p-4 text-sm text-sand-200/60">
        Calculating estimate…
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="rounded-2xl border border-white/10 bg-forest-950/50 p-4 text-sm text-sand-200/60">
        Select dates to see your estimated total.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-glow/20 bg-forest-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-glow">Estimated total</p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-sand-200/60">
            {formatMoney(estimate.nightlyRateCents)} × {estimate.nights} night{estimate.nights === 1 ? '' : 's'}
          </dt>
          <dd className="font-medium text-sand-100">{formatMoney(estimate.nightlySubtotalCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sand-200/60">Cleaning fee</dt>
          <dd className="font-medium text-sand-100">{formatMoney(estimate.cleaningFeeCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sand-200/60">Package</dt>
          <dd className="font-medium text-sand-100">{formatMoney(estimate.bundlePriceCents)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/10 pt-2">
          <dt className="font-semibold text-sand-50">Total estimate</dt>
          <dd className="text-lg font-semibold text-amber-glow">{formatMoney(estimate.totalCents)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-sand-200/50">No payment due until the owner accepts your request.</p>
    </div>
  );
}

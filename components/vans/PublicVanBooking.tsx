'use client';

import { useState } from 'react';
import { BookingForm } from '@/components/BookingForm';

type PublicVanBookingProps = {
  vanId: string;
  festivals: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
  }[];
  bundles: { id: string; name: string; description: string; priceCents: number }[];
  defaultFestivalId?: string;
};

export function PublicVanBooking({ vanId, festivals, bundles, defaultFestivalId }: PublicVanBookingProps) {
  const initialFestivalId =
    defaultFestivalId && festivals.some((f) => f.id === defaultFestivalId)
      ? defaultFestivalId
      : festivals[0]?.id ?? '';

  const [festivalId, setFestivalId] = useState(initialFestivalId);

  if (festivals.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-6 text-center">
        <p className="text-sm text-sand-200/70">
          Online booking is not yet available for this van&apos;s festivals. Check back soon or browse festival pages.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-amber-glow/20 bg-gradient-to-br from-amber-glow/10 via-forest-900/80 to-forest-950/80 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Request to Book</p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
        Reserve this van for your festival
      </h2>
      <p className="mt-2 text-sm text-sand-200/70">
        Choose your festival, pick a package, and submit a booking request. No payment until approved.
      </p>

      {festivals.length > 1 && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-sand-200/80">Festival</label>
          <select
            className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-4 py-3 text-sm text-sand-50"
            value={festivalId}
            onChange={(e) => setFestivalId(e.target.value)}
          >
            {festivals.map((festival) => (
              <option key={festival.id} value={festival.id}>
                {festival.name} · {festival.city}, {festival.state}
              </option>
            ))}
          </select>
        </div>
      )}

      {festivalId && (
        <div className="mt-6">
          <BookingForm festivalId={festivalId} vanId={vanId} bundles={bundles} />
        </div>
      )}
    </div>
  );
}

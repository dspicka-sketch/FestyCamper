'use client';

import {
  AMENITY_OPTIONS,
  FESTIVAL_OPTIONS,
} from '@/lib/owner/onboarding-constants';
import { formatUsd, dollarsToCents, estimateEarnings } from '@/lib/owner/earnings-estimate';
import type { VanOnboardingData } from '@/lib/owner/onboarding-types';

type StepReviewProps = {
  data: VanOnboardingData;
};

function amenityLabel(id: string) {
  return AMENITY_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

function festivalName(id: string) {
  return FESTIVAL_OPTIONS.find((f) => f.id === id)?.name ?? id;
}

export function StepReview({ data }: StepReviewProps) {
  const { vehicle, photos, amenities, festivals, pricing } = data;
  const cover = photos.find((p) => p.isCover && p.status === 'done') ?? photos.find((p) => p.status === 'done');
  const vehicleTitle = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');
  const earnings = estimateEarnings({
    nightlyRateCents: dollarsToCents(pricing.nightlyRate),
    cleaningFeeCents: dollarsToCents(pricing.cleaningFee),
    minNights: parseInt(pricing.minNights, 10) || 2,
    weekendPricing: pricing.weekendPricing,
    weekendPremiumCents: dollarsToCents(pricing.weekendPremium),
    festivalCount: festivals.length,
  });

  return (
    <div className="space-y-8">
      {cover?.publicUrl && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.publicUrl} alt="Cover" className="aspect-[21/9] w-full object-cover" />
        </div>
      )}

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-glow">Vehicle</h3>
        <div className="mt-3 rounded-2xl border border-white/10 bg-forest-950/40 p-5">
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
            {vehicleTitle}
            {vehicle.trim ? ` · ${vehicle.trim}` : ''}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-sand-200/50">Sleeps</dt>
              <dd className="font-medium text-sand-100">{vehicle.sleeps}</dd>
            </div>
            <div>
              <dt className="text-sand-200/50">Seatbelts</dt>
              <dd className="font-medium text-sand-100">{vehicle.seatbelts}</dd>
            </div>
            <div>
              <dt className="text-sand-200/50">Transmission</dt>
              <dd className="font-medium text-sand-100">{vehicle.transmission}</dd>
            </div>
            <div>
              <dt className="text-sand-200/50">Fuel</dt>
              <dd className="font-medium text-sand-100">{vehicle.fuelType}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-glow">
          Photos ({photos.filter((p) => p.status === 'done').length})
        </h3>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos
            .filter((p) => p.status === 'done')
            .map((photo) => (
              <div key={photo.id} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.publicUrl} alt="" className="h-full w-full object-cover" />
                {photo.isCover && (
                  <span className="absolute left-1 top-1 rounded bg-amber-glow px-1 text-[10px] font-bold text-forest-950">
                    Cover
                  </span>
                )}
              </div>
            ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-glow">Amenities</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {amenities.map((id) => (
            <span
              key={id}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-sand-100"
            >
              {amenityLabel(id)}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-glow">Festivals</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {festivals.map((id) => (
            <span
              key={id}
              className="rounded-full border border-amber-glow/30 bg-amber-glow/10 px-3 py-1 text-sm font-medium text-amber-glow"
            >
              {festivalName(id)}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-glow">Pricing</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-forest-950/40 p-4">
            <p className="text-sm text-sand-200/50">Nightly rate</p>
            <p className="mt-1 text-lg font-semibold text-sand-50">{formatUsd(dollarsToCents(pricing.nightlyRate))}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-forest-950/40 p-4">
            <p className="text-sm text-sand-200/50">Cleaning fee</p>
            <p className="mt-1 text-lg font-semibold text-sand-50">{formatUsd(dollarsToCents(pricing.cleaningFee))}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-forest-950/40 p-4">
            <p className="text-sm text-sand-200/50">Security deposit</p>
            <p className="mt-1 text-lg font-semibold text-sand-50">
              {formatUsd(dollarsToCents(pricing.securityDeposit))}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-forest-950/40 p-4">
            <p className="text-sm text-sand-200/50">Minimum nights</p>
            <p className="mt-1 text-lg font-semibold text-sand-50">{pricing.minNights}</p>
          </div>
        </div>
        {pricing.weekendPricing && (
          <p className="mt-3 text-sm text-sand-200/60">
            Weekend premium: +{formatUsd(dollarsToCents(pricing.weekendPremium))}/night on Fri & Sat
          </p>
        )}
      </section>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
        <p className="text-sm text-emerald-200/80">Estimated season earnings</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-emerald-300">
          {formatUsd(earnings.seasonNet)}
        </p>
      </div>
    </div>
  );
}

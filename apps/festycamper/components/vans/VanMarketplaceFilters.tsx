'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { AMENITY_OPTIONS, TRANSMISSION_OPTIONS } from '@/lib/owner/onboarding-constants';

type FestivalOption = { slug: string; name: string };

type VanMarketplaceFiltersProps = {
  festivals: FestivalOption[];
  initial: {
    festival?: string;
    sleeps?: string;
    priceMin?: string;
    priceMax?: string;
    amenities: string[];
    transmission?: string;
    petFriendly?: boolean;
  };
  resultCount: number;
};

export function VanMarketplaceFilters({ festivals, initial, resultCount }: VanMarketplaceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [festival, setFestival] = useState(initial.festival ?? '');
  const [sleeps, setSleeps] = useState(initial.sleeps ?? '');
  const [priceMin, setPriceMin] = useState(initial.priceMin ?? '');
  const [priceMax, setPriceMax] = useState(initial.priceMax ?? '');
  const [amenities, setAmenities] = useState<string[]>(initial.amenities);
  const [transmission, setTransmission] = useState(initial.transmission ?? '');
  const [petFriendly, setPetFriendly] = useState(initial.petFriendly ?? false);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete('festival', festival);
    setOrDelete('sleeps', sleeps);
    setOrDelete('priceMin', priceMin);
    setOrDelete('priceMax', priceMax);
    setOrDelete('transmission', transmission);

    if (amenities.length > 0) params.set('amenities', amenities.join(','));
    else params.delete('amenities');

    if (petFriendly) params.set('petFriendly', '1');
    else params.delete('petFriendly');

    router.push(`/vans?${params.toString()}`);
    setMobileOpen(false);
  }, [amenities, festival, petFriendly, priceMax, priceMin, router, searchParams, sleeps, transmission]);

  function clearFilters() {
    router.push('/vans');
    setFestival('');
    setSleeps('');
    setPriceMin('');
    setPriceMax('');
    setAmenities([]);
    setTransmission('');
    setPetFriendly(false);
    setMobileOpen(false);
  }

  function toggleAmenity(id: string) {
    setAmenities((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const filterFields = (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-200/50">
          Festival
        </label>
        <select
          value={festival}
          onChange={(e) => setFestival(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-3 py-2.5 text-sm text-sand-50"
        >
          <option value="">All festivals</option>
          {festivals.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-200/50">
          Min sleeps
        </label>
        <select
          value={sleeps}
          onChange={(e) => setSleeps(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-3 py-2.5 text-sm text-sand-50"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-200/50">
            Min $/night
          </label>
          <input
            type="number"
            min={0}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-3 py-2.5 text-sm text-sand-50"
            placeholder="100"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-200/50">
            Max $/night
          </label>
          <input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-3 py-2.5 text-sm text-sand-50"
            placeholder="400"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-200/50">
          Transmission
        </label>
        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-3 py-2.5 text-sm text-sand-50"
        >
          <option value="">Any</option>
          {TRANSMISSION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sand-200/50">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => {
            const selected = amenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selected
                    ? 'border-amber-glow/50 bg-amber-glow/10 text-amber-glow'
                    : 'border-white/10 bg-white/5 text-sand-200/70 hover:border-white/20'
                }`}
              >
                {amenity.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-forest-950/40 px-4 py-3">
        <input
          type="checkbox"
          checked={petFriendly}
          onChange={(e) => setPetFriendly(e.target.checked)}
          className="h-4 w-4 accent-amber-glow"
        />
        <span className="text-sm text-sand-100">Pet friendly only</span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={applyFilters}
          className="flex-1 rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-4 py-3 text-sm font-semibold text-forest-950"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-sand-100"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm text-sand-200/60">{resultCount} vans found</p>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-sand-100"
        >
          {mobileOpen ? 'Hide filters' : 'Filters'}
        </button>
      </div>

      <div className={`lg:block ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-5 lg:sticky lg:top-28">
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Filters</h2>
            <span className="text-xs text-sand-200/50">{resultCount} results</span>
          </div>
          {filterFields}
        </div>
      </div>
    </div>
  );
}

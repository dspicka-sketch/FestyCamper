'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AMENITY_OPTIONS,
  FESTIVAL_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  YEAR_OPTIONS,
} from '@/lib/owner/onboarding-constants';
import {
  ownerButtonPrimaryClassName,
  ownerButtonSecondaryClassName,
  ownerErrorClassName,
  ownerInputClassName,
  ownerLabelClassName,
} from '@/components/owner/auth-ui';

type VanEditFormProps = {
  vanId: string;
  initial: {
    year: string;
    make: string;
    model: string;
    trim: string;
    sleeps: string;
    seatbelts: string;
    transmission: string;
    fuelType: string;
    location: string;
    amenities: string[];
    festivals: string[];
    nightlyRate: string;
    cleaningFee: string;
    securityDeposit: string;
    minNights: string;
    weekendPricing: boolean;
    weekendPremium: string;
    photos: { id: string; publicUrl: string; isCover: boolean }[];
  };
};

export function VanEditForm({ vanId, initial }: VanEditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleAmenity(id: string) {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(id)
        ? current.amenities.filter((item) => item !== id)
        : [...current.amenities, id],
    }));
  }

  function toggleFestival(id: string) {
    setForm((current) => ({
      ...current,
      festivals: current.festivals.includes(id)
        ? current.festivals.filter((item) => item !== id)
        : [...current.festivals, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await fetch(`/api/owner/vans/${vanId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const body = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError(body.error ?? 'Unable to save changes.');
      setLoading(false);
      return;
    }

    setSuccess('Listing updated successfully.');
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Vehicle</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={ownerLabelClassName} htmlFor="year">Year</label>
            <select id="year" className={ownerInputClassName} value={form.year} onChange={(e) => updateField('year', e.target.value)} required>
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="make">Make</label>
            <input id="make" className={ownerInputClassName} value={form.make} onChange={(e) => updateField('make', e.target.value)} required />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="model">Model</label>
            <input id="model" className={ownerInputClassName} value={form.model} onChange={(e) => updateField('model', e.target.value)} required />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="trim">Trim</label>
            <input id="trim" className={ownerInputClassName} value={form.trim} onChange={(e) => updateField('trim', e.target.value)} />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="sleeps">Sleeps</label>
            <input id="sleeps" type="number" min={1} className={ownerInputClassName} value={form.sleeps} onChange={(e) => updateField('sleeps', e.target.value)} required />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="seatbelts">Seatbelts</label>
            <input id="seatbelts" type="number" min={1} className={ownerInputClassName} value={form.seatbelts} onChange={(e) => updateField('seatbelts', e.target.value)} required />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="transmission">Transmission</label>
            <select id="transmission" className={ownerInputClassName} value={form.transmission} onChange={(e) => updateField('transmission', e.target.value)}>
              {TRANSMISSION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="fuelType">Fuel Type</label>
            <select id="fuelType" className={ownerInputClassName} value={form.fuelType} onChange={(e) => updateField('fuelType', e.target.value)}>
              {FUEL_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={ownerLabelClassName} htmlFor="location">Location</label>
            <input id="location" className={ownerInputClassName} value={form.location} onChange={(e) => updateField('location', e.target.value)} required />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Photos</h2>
        <p className="text-sm text-sand-200/60">Existing photos are preserved. Contact support to replace images.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {form.photos.map((photo) => (
            <div key={photo.id} className="relative overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.publicUrl} alt="" className="aspect-[4/3] w-full object-cover" />
              {photo.isCover && (
                <span className="absolute left-2 top-2 rounded-full bg-amber-glow px-2 py-0.5 text-[10px] font-bold text-forest-950">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Amenities</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AMENITY_OPTIONS.map((amenity) => {
            const selected = form.amenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`rounded-2xl border p-4 text-center transition-colors ${
                  selected
                    ? 'border-amber-glow/50 bg-amber-glow/10 text-amber-glow'
                    : 'border-white/10 bg-forest-950/40 text-sand-100 hover:border-white/20'
                }`}
              >
                <span className="block text-xl">{amenity.icon}</span>
                <span className="mt-2 block text-sm font-medium">{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Festivals</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FESTIVAL_OPTIONS.map((festival) => {
            const selected = form.festivals.includes(festival.id);
            return (
              <button
                key={festival.id}
                type="button"
                onClick={() => toggleFestival(festival.id)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  selected
                    ? 'border-amber-glow/50 bg-amber-glow/10'
                    : 'border-white/10 bg-forest-950/40 hover:border-white/20'
                }`}
              >
                <p className="font-medium text-sand-50">{festival.name}</p>
                <p className="mt-1 text-sm text-sand-200/60">{festival.location}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Pricing</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={ownerLabelClassName} htmlFor="nightlyRate">Nightly Rate ($)</label>
            <input id="nightlyRate" type="number" min={0} className={ownerInputClassName} value={form.nightlyRate} onChange={(e) => updateField('nightlyRate', e.target.value)} />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="cleaningFee">Cleaning Fee ($)</label>
            <input id="cleaningFee" type="number" min={0} className={ownerInputClassName} value={form.cleaningFee} onChange={(e) => updateField('cleaningFee', e.target.value)} />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="securityDeposit">Security Deposit ($)</label>
            <input id="securityDeposit" type="number" min={0} className={ownerInputClassName} value={form.securityDeposit} onChange={(e) => updateField('securityDeposit', e.target.value)} />
          </div>
          <div>
            <label className={ownerLabelClassName} htmlFor="minNights">Minimum Nights</label>
            <input id="minNights" type="number" min={1} className={ownerInputClassName} value={form.minNights} onChange={(e) => updateField('minNights', e.target.value)} />
          </div>
        </div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.weekendPricing}
            onChange={(e) => updateField('weekendPricing', e.target.checked)}
            className="mt-1 h-4 w-4 accent-amber-glow"
          />
          <span className="text-sm text-sand-200/80">Enable weekend premium pricing</span>
        </label>
        {form.weekendPricing && (
          <div>
            <label className={ownerLabelClassName} htmlFor="weekendPremium">Weekend premium ($)</label>
            <input id="weekendPremium" type="number" min={0} className={ownerInputClassName} value={form.weekendPremium} onChange={(e) => updateField('weekendPremium', e.target.value)} />
          </div>
        )}
      </section>

      {error && <p className={ownerErrorClassName}>{error}</p>}
      {success && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={() => router.push('/owner/vans')} className={ownerButtonSecondaryClassName}>
          Back to listings
        </button>
        <button type="submit" disabled={loading} className={ownerButtonPrimaryClassName}>
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

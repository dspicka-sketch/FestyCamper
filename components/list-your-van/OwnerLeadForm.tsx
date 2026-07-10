'use client';

import { useState } from 'react';

const inputClassName =
  'w-full rounded-xl border border-white/15 bg-forest-950/80 px-4 py-3 text-sm text-sand-50 placeholder:text-sand-200/40 transition-colors duration-200 focus:border-amber-glow/50 focus:outline-none focus:ring-2 focus:ring-amber-glow/20';

const labelClassName = 'mb-2 block text-sm font-medium text-sand-200/80';

export function OwnerLeadForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(formData: FormData) {
    setStatus('submitting');
    setMessage('');

    const payload = Object.fromEntries(formData.entries());

    const res = await fetch('/api/owner-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus('error');
      setMessage('Something went wrong. Please check your details and try again.');
      return;
    }

    setStatus('success');
    setMessage('Thanks! We received your listing request and will follow up within 1–2 business days.');
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl">
          ✓
        </div>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
          Submission received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sand-200/70">{message}</p>
      </div>
    );
  }

  return (
    <form action={submit} className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
          Owner details
        </h2>
        <p className="mt-2 text-sm text-sand-200/60">Tell us how to reach you about your listing.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClassName} htmlFor="ownerName">Owner name</label>
            <input className={inputClassName} id="ownerName" name="ownerName" required placeholder="Jane Smith" />
          </div>
          <div>
            <label className={labelClassName} htmlFor="email">Email</label>
            <input className={inputClassName} id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className={labelClassName} htmlFor="phone">Phone</label>
            <input className={inputClassName} id="phone" name="phone" type="tel" placeholder="(555) 555-1212" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
          Van details
        </h2>
        <p className="mt-2 text-sm text-sand-200/60">Share the basics about your festival-ready rig.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClassName} htmlFor="vanYearMakeModel">Van year / make / model</label>
            <input
              className={inputClassName}
              id="vanYearMakeModel"
              name="vanYearMakeModel"
              required
              placeholder="2021 Mercedes-Benz Sprinter 170"
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="sleeps">Sleeps</label>
            <input className={inputClassName} id="sleeps" name="sleeps" type="number" min="1" max="12" defaultValue="2" required />
          </div>
          <div>
            <label className={labelClassName} htmlFor="homeCity">Home city</label>
            <input className={inputClassName} id="homeCity" name="homeCity" required placeholder="Los Angeles, CA" />
          </div>
          <div>
            <label className={labelClassName} htmlFor="nightlyRate">Nightly rate (USD)</label>
            <input
              className={inputClassName}
              id="nightlyRate"
              name="nightlyRate"
              type="number"
              min="1"
              step="1"
              required
              placeholder="245"
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="photosUrl">Photos URL</label>
            <input
              className={inputClassName}
              id="photosUrl"
              name="photosUrl"
              type="url"
              placeholder="https://drive.google.com/..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClassName} htmlFor="festivalAvailability">Festival availability</label>
            <input
              className={inputClassName}
              id="festivalAvailability"
              name="festivalAvailability"
              required
              placeholder="Coachella, LIB, Burning Man — or all major SoCal festivals"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClassName} htmlFor="notes">Notes</label>
            <textarea
              className={`${inputClassName} min-h-[120px] resize-y`}
              id="notes"
              name="notes"
              rows={4}
              placeholder="Amenities, festival rules, delivery radius, blackout dates, etc."
            />
          </div>
        </div>
      </div>

      {status === 'error' && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-8 py-4 text-base font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-glow/35 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit listing request'}
      </button>
    </form>
  );
}

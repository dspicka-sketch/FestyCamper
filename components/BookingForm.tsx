'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingEstimatePanel } from '@/components/booking/BookingEstimate';
import type { BookingEstimate } from '@/lib/pricing';
import { formatDateInput } from '@/lib/booking/dates';

type BookingFormProps = {
  festivalId: string;
  vanId: string;
  minNights: number;
  maxGuests: number;
  defaultArrival: string;
  defaultDeparture: string;
  bundles: { id: string; name: string; description: string; priceCents: number }[];
};

const inputClassName =
  'w-full rounded-xl border border-white/15 bg-forest-950/80 px-4 py-3 text-sm text-sand-50';

export function BookingForm({
  festivalId,
  vanId,
  minNights,
  maxGuests,
  defaultArrival,
  defaultDeparture,
  bundles,
}: BookingFormProps) {
  const router = useRouter();
  const [bundleId, setBundleId] = useState(bundles[0]?.id ?? '');
  const [arrivalAt, setArrivalAt] = useState(defaultArrival);
  const [departureAt, setDepartureAt] = useState(defaultDeparture);
  const [estimate, setEstimate] = useState<BookingEstimate | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canEstimate = useMemo(
    () => Boolean(vanId && bundleId && arrivalAt && departureAt),
    [vanId, bundleId, arrivalAt, departureAt],
  );

  useEffect(() => {
    if (!canEstimate) {
      setEstimate(null);
      return;
    }

    const controller = new AbortController();
    setEstimateLoading(true);

    fetch('/api/booking-requests/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vanId, bundleId, arrivalAt, departureAt }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to calculate estimate.');
        setEstimate(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setEstimate(null);
        setStatus(error instanceof Error ? error.message : 'Unable to calculate estimate.');
      })
      .finally(() => setEstimateLoading(false));

    return () => controller.abort();
  }, [canEstimate, vanId, bundleId, arrivalAt, departureAt]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('Submitting request...');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch('/api/booking-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        festivalId,
        vanId,
        bundleId,
        arrivalAt,
        departureAt,
        guests: Number(payload.guests),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      setStatus(typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.');
      return;
    }

    router.push(`/booking/access/${data.accessToken}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-sand-200/80">Arrival</label>
          <input
            className={inputClassName}
            type="date"
            name="arrivalAt"
            value={arrivalAt}
            onChange={(e) => setArrivalAt(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-sand-200/80">Departure</label>
          <input
            className={inputClassName}
            type="date"
            name="departureAt"
            value={departureAt}
            onChange={(e) => setDepartureAt(e.target.value)}
            required
          />
        </div>
      </div>
      <p className="text-xs text-sand-200/50">Minimum stay: {minNights} night{minNights === 1 ? '' : 's'}. Dates may extend before or after the festival.</p>

      <BookingEstimatePanel estimate={estimate} loading={estimateLoading} />

      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Name</label>
        <input className={inputClassName} name="renterName" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Email</label>
        <input className={inputClassName} name="renterEmail" type="email" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Phone</label>
        <input className={inputClassName} name="renterPhone" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Group size</label>
        <input
          className={inputClassName}
          name="guests"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={Math.min(2, maxGuests)}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Package</label>
        <select
          className={inputClassName}
          name="bundleId"
          value={bundleId}
          onChange={(e) => setBundleId(e.target.value)}
          required
        >
          {bundles.map((bundle) => (
            <option value={bundle.id} key={bundle.id}>
              {bundle.name} — ${Math.round(bundle.priceCents / 100)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Pickup / delivery preference</label>
        <select className={inputClassName} name="pickupType" required>
          <option value="pickup">I will pick up the van</option>
          <option value="airport">Airport pickup add-on</option>
          <option value="festival-delivery">Festival-area delivery</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Message to owner</label>
        <textarea
          name="renterMessage"
          rows={3}
          className={inputClassName}
          placeholder="Tell the owner about your trip, arrival plans, or questions."
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-sand-200/80">Trip needs</label>
        <textarea
          name="tripNeeds"
          rows={3}
          className={inputClassName}
          placeholder="Bedding, shade, power, early arrival, camping pass type, etc."
        />
      </div>

      <button
        type="submit"
        disabled={submitting || estimateLoading || !estimate}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit booking request'}
      </button>
      {status && <p className="text-sm text-sand-200/70">{status}</p>}
    </form>
  );
}

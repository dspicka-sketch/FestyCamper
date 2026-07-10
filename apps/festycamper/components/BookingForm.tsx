'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function BookingForm({ festivalId, vanId, bundles }: { festivalId: string; vanId: string; bundles: { id: string; name: string; description: string; priceCents: number }[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setStatus('Submitting request...');
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch('/api/booking-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, festivalId, vanId })
    });

    if (!res.ok) {
      setSubmitting(false);
      setStatus('Something went wrong. Please try again.');
      return;
    }

    const data = await res.json();
    router.push(`/booking/confirmation/${data.bookingId}`);
  }

  return (
    <form action={submit} className="card">
      <h3>Request this festival package</h3>
      <label>Name</label>
      <input className="input" name="renterName" required />
      <label>Email</label>
      <input className="input" name="renterEmail" type="email" required />
      <label>Phone</label>
      <input className="input" name="renterPhone" />
      <label>Guests</label>
      <input className="input" name="guests" type="number" min="1" defaultValue="2" required />
      <label>Package</label>
      <select name="bundleId" required>
        {bundles.map((bundle) => (
          <option value={bundle.id} key={bundle.id}>{bundle.name} — ${Math.round(bundle.priceCents / 100)}</option>
        ))}
      </select>
      <label>Pickup / delivery preference</label>
      <select name="pickupType" required>
        <option value="pickup">I will pick up the van</option>
        <option value="airport">Airport pickup add-on</option>
        <option value="festival-delivery">Festival-area delivery</option>
      </select>
      <label>Notes</label>
      <textarea name="notes" rows={4} className="input" placeholder="Flight arrival, camping pass type, group needs, etc." />
      <button className="button" style={{ marginTop: 16 }} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Request booking'}
      </button>
      {status && <p className="muted">{status}</p>}
    </form>
  );
}

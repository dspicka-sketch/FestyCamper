'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { BookingMessageRole, BookingStatus } from '@prisma/client';
import { BookingMessageThread } from '@/components/booking/BookingMessageThread';
import { formatMoney } from '@/lib/pricing';

type OwnerBookingDetailProps = {
  booking: {
    id: string;
    status: BookingStatus;
    renterName: string;
    renterEmail: string;
    renterPhone: string | null;
    guests: number;
    pickupType: string;
    arrivalAt: string;
    departureAt: string;
    nights: number;
    totalCents: number;
    renterMessage: string | null;
    tripNeeds: string | null;
    festival: { name: string };
    van: { name: string };
    bundle: { name: string };
    messages: {
      id: string;
      senderRole: BookingMessageRole;
      body: string;
      createdAt: string;
    }[];
  };
};

function formatStayDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function OwnerBookingDetail({ booking }: OwnerBookingDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [messages, setMessages] = useState(booking.messages);
  const [declineReason, setDeclineReason] = useState('');
  const [actionError, setActionError] = useState('');
  const [loadingAction, setLoadingAction] = useState<'APPROVED' | 'DECLINED' | null>(null);

  const closed = status === 'DECLINED' || status === 'CANCELLED' || status === 'PAID';

  async function sendMessage(body: string) {
    const res = await fetch(`/api/owner/bookings/${booking.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Unable to send message.');
    }
    setMessages((current) => [...current, { ...data.message, createdAt: data.message.createdAt }]);
    router.refresh();
  }

  async function updateStatus(nextStatus: 'APPROVED' | 'DECLINED') {
    setLoadingAction(nextStatus);
    setActionError('');

    const res = await fetch(`/api/owner/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: nextStatus,
        declineReason: nextStatus === 'DECLINED' ? declineReason : undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setActionError(typeof data.error === 'string' ? data.error : 'Unable to update booking.');
      setLoadingAction(null);
      return;
    }

    setStatus(data.status);
    setLoadingAction(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Booking request</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50">
          {booking.renterName}
        </h1>
        <p className="mt-2 text-sm text-sand-200/70">
          {booking.festival.name} · {booking.van.name} · {booking.bundle.name}
        </p>
        <p className="mt-4 text-sm text-sand-200/60">
          {formatStayDate(booking.arrivalAt)} → {formatStayDate(booking.departureAt)} · {booking.nights} night
          {booking.nights === 1 ? '' : 's'} · {booking.guests} guest{booking.guests === 1 ? '' : 's'}
        </p>
        <p className="mt-2 text-lg font-semibold text-amber-glow">Estimated total {formatMoney(booking.totalCents)}</p>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-sand-200/50">Email</dt>
            <dd className="font-medium text-sand-100">{booking.renterEmail}</dd>
          </div>
          <div>
            <dt className="text-sand-200/50">Phone</dt>
            <dd className="font-medium text-sand-100">{booking.renterPhone || '—'}</dd>
          </div>
          <div>
            <dt className="text-sand-200/50">Pickup / delivery</dt>
            <dd className="font-medium capitalize text-sand-100">{booking.pickupType.replace('-', ' ')}</dd>
          </div>
          <div>
            <dt className="text-sand-200/50">Status</dt>
            <dd className="font-medium capitalize text-sand-100">{status.toLowerCase()}</dd>
          </div>
        </dl>

        {booking.tripNeeds && (
          <div className="mt-4 rounded-xl bg-white/[0.03] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-200/50">Trip needs</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-sand-200/70">{booking.tripNeeds}</p>
          </div>
        )}
      </div>

      <BookingMessageThread
        messages={messages}
        viewerRole="OWNER"
        onSend={sendMessage}
        disabled={closed}
      />

      {!closed && (
        <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Decision</h2>
          <p className="mt-2 text-sm text-sand-200/70">
            Ask any follow-up questions above, then accept or decline when you have enough information.
          </p>

          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            rows={3}
            className="mt-4 w-full rounded-xl border border-white/15 bg-forest-950/80 px-4 py-3 text-sm text-sand-50"
            placeholder="Optional decline reason for the renter"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateStatus('APPROVED')}
              disabled={loadingAction !== null || status === 'APPROVED'}
              className="rounded-full bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingAction === 'APPROVED' ? 'Accepting…' : status === 'APPROVED' ? 'Accepted' : 'Accept request'}
            </button>
            <button
              type="button"
              onClick={() => updateStatus('DECLINED')}
              disabled={loadingAction !== null}
              className="rounded-full bg-rose-500/15 px-5 py-2.5 text-sm font-semibold text-rose-300 ring-1 ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingAction === 'DECLINED' ? 'Declining…' : 'Decline request'}
            </button>
          </div>
          {actionError && <p className="mt-3 text-sm text-rose-300">{actionError}</p>}
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { BookingMessageRole, BookingStatus } from '@prisma/client';
import { BookingMessageThread } from '@/components/booking/BookingMessageThread';
import { PayDepositButton } from '@/components/booking/PayDepositButton';
import { formatMoney } from '@/lib/pricing';

type BookingSummary = {
  id: string;
  status: BookingStatus;
  renterName: string;
  guests: number;
  pickupType: string;
  arrivalAt: string;
  departureAt: string;
  nights: number;
  totalCents: number;
  tripNeeds: string | null;
  declineReason: string | null;
  depositPaidCents: number;
  festival: { name: string; slug: string; city: string; state: string };
  van: { name: string };
  bundle: { name: string };
};

type Message = {
  id: string;
  senderRole: BookingMessageRole;
  body: string;
  createdAt: string;
};

type RenterBookingViewProps = {
  accessToken: string;
  booking: BookingSummary;
  messages: Message[];
  depositStatus?: string;
};

function formatStayDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function RenterBookingView({ accessToken, booking, messages, depositStatus }: RenterBookingViewProps) {
  const router = useRouter();
  const [threadMessages, setThreadMessages] = useState(messages);
  const closed = booking.status === 'DECLINED' || booking.status === 'CANCELLED';

  async function sendMessage(body: string) {
    const res = await fetch(`/api/bookings/access/${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Unable to send message.');
    }
    setThreadMessages((current) => [...current, { ...data.message, createdAt: data.message.createdAt }]);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Booking request</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50">
          {booking.festival.name}
        </h1>
        <p className="mt-2 text-sm text-sand-200/70">
          {booking.van.name} · {booking.bundle.name}
        </p>
        <p className="mt-4 text-sm text-sand-200/60">
          {formatStayDate(booking.arrivalAt)} → {formatStayDate(booking.departureAt)} · {booking.nights} night
          {booking.nights === 1 ? '' : 's'} · {booking.guests} guest{booking.guests === 1 ? '' : 's'}
        </p>
        <p className="mt-2 text-lg font-semibold text-amber-glow">Estimated total {formatMoney(booking.totalCents)}</p>

        {booking.status === 'REQUESTED' && (
          <p className="mt-4 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
            Your request is with the owner. Use the conversation below if they have questions.
          </p>
        )}
        {booking.status === 'APPROVED' && (
          <p className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            The owner accepted your request. Pay the deposit below to hold your dates.
          </p>
        )}
        {booking.status === 'PAID' && (
          <p className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Deposit received. Verified amount: {formatMoney(booking.depositPaidCents)}.
          </p>
        )}
        {closed && booking.declineReason && (
          <p className="mt-4 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            Owner note: {booking.declineReason}
          </p>
        )}
        {depositStatus === 'success' && booking.status !== 'PAID' && (
          <p className="mt-4 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
            Payment is processing. This page will update after Stripe confirms your deposit.
          </p>
        )}
        {depositStatus === 'cancelled' && (
          <p className="mt-4 rounded-xl border border-amber-glow/25 bg-amber-glow/10 px-4 py-3 text-sm text-amber-glow">
            Deposit checkout was cancelled. You can try again when ready.
          </p>
        )}

        {booking.tripNeeds && (
          <div className="mt-4 rounded-xl bg-white/[0.03] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-200/50">Trip needs</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-sand-200/70">{booking.tripNeeds}</p>
          </div>
        )}
      </div>

      <BookingMessageThread
        messages={threadMessages}
        viewerRole="RENTER"
        onSend={sendMessage}
        disabled={closed || booking.status === 'PAID'}
      />

      {booking.status === 'APPROVED' && <PayDepositButton bookingId={booking.id} accessToken={accessToken} />}

      <p className="text-xs text-sand-200/40">
        Save this private link to return to your request. If you lose it, contact support with your booking reference and
        email.
      </p>
    </div>
  );
}

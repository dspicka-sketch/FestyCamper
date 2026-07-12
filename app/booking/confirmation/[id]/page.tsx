import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatFestivalDates } from '@/lib/dates';
import { formatMoney } from '@/lib/pricing';
import { PayDepositButton } from '@/components/booking/PayDepositButton';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

const NEXT_STEPS = [
  {
    step: '1',
    title: 'We review your request',
    description: 'Our team checks van availability and confirms festival approval within 24 hours.',
  },
  {
    step: '2',
    title: 'You get a confirmation email',
    description: 'We will send details about pickup or delivery, timing, and any final questions.',
  },
  {
    step: '3',
    title: 'Pay your deposit',
    description: 'Optionally pay a $250 deposit now to hold your spot while we confirm availability.',
  },
  {
    step: '4',
    title: 'Complete remaining balance',
    description: 'After approval, pay the remaining balance to lock in your full festival package.',
  },
  {
    step: '5',
    title: 'Roll in ready',
    description: 'Show up with bedding, shade, solar, and camp gear bundled and ready to go.',
  },
];

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: PageProps<'/booking/confirmation/[id]'>) {
  const { id } = await params;
  const { deposit } = await searchParams;

  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: { festival: true, van: true, bundle: true },
  });

  if (!booking) notFound();

  const festivalDates = formatFestivalDates(booking.festival.startsAt, booking.festival.endsAt);

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-32 text-center sm:px-8 sm:pt-36">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl ring-1 ring-emerald-500/30">
            ✓
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-300">Request received</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
            You&apos;re on your way to {booking.festival.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-sand-200/70">
            Thanks, {booking.renterName}! We received your booking request and will follow up at{' '}
            <span className="text-sand-100">{booking.renterEmail}</span>.
          </p>

          {booking.status === 'PAID' && (
            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
              Deposit payment received and verified. Thank you — our team will confirm your trip details shortly.
            </div>
          )}
          {deposit === 'success' && booking.status !== 'PAID' && (
            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-sky-500/30 bg-sky-500/10 px-5 py-4 text-sm text-sky-200">
              Payment is processing. This page will show the verified status after Stripe confirms it.
            </div>
          )}
          {deposit === 'cancelled' && (
            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-amber-glow/30 bg-amber-glow/10 px-5 py-4 text-sm text-amber-glow">
              Deposit payment was cancelled. You can try again below whenever you&apos;re ready.
            </div>
          )}
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/30 to-forest-950" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
              Your festival package
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Festival</dt>
                <dd className="text-right font-medium text-sand-100">{booking.festival.name}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Location</dt>
                <dd className="text-right text-sand-100">
                  {booking.festival.city}, {booking.festival.state}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Dates</dt>
                <dd className="text-right text-sand-100">{festivalDates}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Van</dt>
                <dd className="text-right text-sand-100">{booking.van.name}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Bundle</dt>
                <dd className="text-right text-sand-100">{booking.bundle.name}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Guests</dt>
                <dd className="text-right text-sand-100">{booking.guests}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <dt className="text-sand-200/50">Pickup</dt>
                <dd className="text-right capitalize text-sand-100">{booking.pickupType.replace('-', ' ')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sand-200/50">Estimated total</dt>
                <dd className="text-right text-lg font-semibold text-amber-glow">{formatMoney(booking.totalCents)}</dd>
              </div>
            </dl>

            {booking.notes && (
              <div className="mt-6 rounded-2xl bg-white/[0.03] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-200/50">Your notes</p>
                <p className="mt-2 text-sm text-sand-200/70">{booking.notes}</p>
              </div>
            )}

            <p className="mt-6 text-xs text-sand-200/40">
              Reference #{booking.id.slice(0, 8).toUpperCase()}
            </p>

            {booking.status === 'PAID' ? (
              <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5 text-sm text-emerald-200">
                Verified deposit: {formatMoney(booking.depositPaidCents)}
              </div>
            ) : booking.status === 'DECLINED' || booking.status === 'CANCELLED' ? (
              <div className="mt-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 text-sm text-rose-200">
                This booking is no longer eligible for payment. Contact support if you believe this is an error.
              </div>
            ) : (
              <PayDepositButton bookingId={booking.id} />
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
              What happens next
            </h2>
            <ol className="mt-6 space-y-4">
              {NEXT_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-forest-900/40 p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-glow/15 text-sm font-bold text-amber-glow">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-50">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-sand-200/70">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/festivals/${booking.festival.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/5"
            >
              Back to festival
            </Link>
            <Link
              href="/festivals"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Browse more festivals
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireOwnerSession } from '@/lib/owner/auth';
import { formatMoney } from '@/lib/pricing';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

function formatStayDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function OwnerBookingsPage() {
  const { owner } = await requireOwnerSession('/owner/bookings');

  const bookings = owner
    ? await prisma.bookingRequest.findMany({
        where: { van: { ownerId: owner.id } },
        include: {
          festival: true,
          van: { select: { name: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
      })
    : [];

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/40 to-forest-950" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <Link href="/owner/dashboard" className="text-sm font-medium text-amber-glow hover:text-amber-glow/80">
            ← Owner dashboard
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-sand-50">
            Booking requests
          </h1>
          <p className="mt-2 text-sand-200/70">Review requests, reply to renters, and accept or decline when ready.</p>

          {bookings.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-white/10 bg-forest-900/60 p-10 text-center">
              <p className="text-lg font-semibold text-sand-50">No booking requests yet</p>
              <p className="mt-2 text-sm text-sand-200/70">Requests for your vans will appear here.</p>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/owner/bookings/${booking.id}`}
                  className="block rounded-2xl border border-white/10 bg-forest-900/60 p-5 transition-colors hover:border-amber-glow/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-sand-50">{booking.renterName}</p>
                      <p className="mt-1 text-sm text-sand-200/70">
                        {booking.festival.name} · {booking.van.name}
                      </p>
                      <p className="mt-2 text-xs text-sand-200/50">
                        {formatStayDate(booking.arrivalAt)} → {formatStayDate(booking.departureAt)} · {booking.guests}{' '}
                        guest{booking.guests === 1 ? '' : 's'}
                      </p>
                      {booking.messages[0] && (
                        <p className="mt-3 line-clamp-2 text-sm text-sand-200/60">{booking.messages[0].body}</p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-sand-100">
                        {booking.status.toLowerCase()}
                      </span>
                      <p className="mt-3 text-sm font-semibold text-amber-glow">{formatMoney(booking.totalCents)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

import Link from 'next/link';
import { BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { formatFestivalDates } from '@/lib/dates';
import { formatMoney } from '@/lib/pricing';
import { BookingActions } from '@/components/admin/BookingActions';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

const STATUS_STYLES: Record<BookingStatus, string> = {
  REQUESTED: 'bg-amber-glow/15 text-amber-glow ring-amber-glow/30',
  APPROVED: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  DECLINED: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  PAID: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  CANCELLED: 'bg-white/5 text-sand-200/60 ring-white/10',
};

function formatSubmittedAt(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${STATUS_STYLES[status]}`}
    >
      {status.toLowerCase()}
    </span>
  );
}

function SectionHeading({
  id,
  title,
  description,
  count,
}: {
  id: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sand-200/70">{description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-sand-200/60">
          {count} total
        </span>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-forest-900/40 px-8 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-glow/10 text-2xl">
        {icon}
      </div>
      <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sand-200/70">{description}</p>
      <Link
        href={href}
        className="mt-8 inline-flex rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 transition-all duration-300 hover:-translate-y-0.5"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default async function AdminPage() {
  const [requests, leads] = await Promise.all([
    prisma.bookingRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { festival: true, van: true, bundle: true },
    }),
    prisma.ownerLead.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const statusCounts = requests.reduce(
    (acc, request) => {
      acc[request.status] = (acc[request.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<BookingStatus, number>,
  );

  const pendingCount = statusCounts.REQUESTED ?? 0;

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-amber-glow)_0%,_transparent_45%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-32 sm:px-8 sm:pt-36">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Admin</p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
                Operations dashboard
              </h1>
              <p className="mt-4 max-w-xl text-lg text-sand-200/70">
                Review renter booking requests and owner listing leads in one place.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/5"
            >
              ← Back to site
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Booking requests', value: requests.length },
              { label: 'Pending review', value: pendingCount },
              { label: 'Owner leads', value: leads.length },
              { label: 'Approved', value: statusCounts.APPROVED ?? 0 },
              { label: 'Paid', value: statusCounts.PAID ?? 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-forest-900/60 px-5 py-4 backdrop-blur-sm"
              >
                <p className="text-sm text-sand-200/60">{stat.label}</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#bookings"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-sand-100 transition-colors hover:border-amber-glow/40"
            >
              Booking requests
            </a>
            <a
              href="#owner-leads"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-sand-100 transition-colors hover:border-amber-glow/40"
            >
              Owner leads
            </a>
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/30 to-forest-950" />
        <div className="relative mx-auto max-w-7xl space-y-20 px-5 sm:px-8">
          {/* Booking requests */}
          <div>
            <SectionHeading
              id="bookings"
              title="Booking requests"
              description="Renter festival package requests awaiting review and approval."
              count={requests.length}
            />

            {requests.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No booking requests yet"
                description="When renters submit festival package requests, they will appear here for review."
                href="/festivals"
                linkLabel="Browse festivals"
              />
            ) : (
              <>
                <div className="mt-8 hidden overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 lg:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-sand-200/50">
                        <th className="px-6 py-4 font-semibold">Customer</th>
                        <th className="px-6 py-4 font-semibold">Festival</th>
                        <th className="px-6 py-4 font-semibold">Van & bundle</th>
                        <th className="px-6 py-4 font-semibold">Dates</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {requests.map((request) => (
                        <tr key={request.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-5">
                            <p className="font-semibold text-sand-50">{request.renterName}</p>
                            <p className="mt-1 text-sand-200/60">{request.renterEmail}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-medium text-sand-100">{request.festival.name}</p>
                            <p className="mt-1 text-xs text-sand-200/50">
                              {request.festival.city}, {request.festival.state}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sand-100">{request.van.name}</p>
                            <p className="mt-1 text-sand-200/60">{request.bundle.name}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sand-100">
                              {formatFestivalDates(request.festival.startsAt, request.festival.endsAt)}
                            </p>
                            <p className="mt-1 text-xs text-sand-200/40">
                              Submitted {formatSubmittedAt(request.createdAt)}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-semibold text-amber-glow">{formatMoney(request.totalCents)}</p>
                          </td>
                          <td className="px-6 py-5">
                            <BookingActions email={request.renterEmail} renterName={request.renterName} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid gap-4 lg:hidden">
                  {requests.map((request) => (
                    <article
                      key={request.id}
                      className="rounded-3xl border border-white/10 bg-forest-900/60 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
                            {request.renterName}
                          </h3>
                          <p className="mt-1 text-sm text-sand-200/60">{request.renterEmail}</p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                      <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-sand-200/50">Festival</dt>
                          <dd className="text-right text-sand-100">{request.festival.name}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-sand-200/50">Total</dt>
                          <dd className="font-semibold text-amber-glow">{formatMoney(request.totalCents)}</dd>
                        </div>
                      </dl>
                      <div className="mt-5">
                        <BookingActions email={request.renterEmail} renterName={request.renterName} />
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Owner leads */}
          <div>
            <SectionHeading
              id="owner-leads"
              title="Owner leads"
              description="Van owners who submitted listing requests through List Your Van."
              count={leads.length}
            />

            {leads.length === 0 ? (
              <EmptyState
                icon="🚐"
                title="No owner leads yet"
                description="When owners submit listing requests, they will appear here for follow-up."
                href="/list-your-van"
                linkLabel="View List Your Van page"
              />
            ) : (
              <>
                <div className="mt-8 hidden overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 lg:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-sand-200/50">
                        <th className="px-6 py-4 font-semibold">Owner</th>
                        <th className="px-6 py-4 font-semibold">Van</th>
                        <th className="px-6 py-4 font-semibold">Location & rate</th>
                        <th className="px-6 py-4 font-semibold">Festival availability</th>
                        <th className="px-6 py-4 font-semibold">Submitted</th>
                        <th className="px-6 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-5">
                            <p className="font-semibold text-sand-50">{lead.ownerName}</p>
                            <p className="mt-1 text-sand-200/60">{lead.email}</p>
                            {lead.phone && <p className="mt-0.5 text-xs text-sand-200/40">{lead.phone}</p>}
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sand-100">{lead.vanYearMakeModel}</p>
                            <p className="mt-1 text-xs text-sand-200/50">Sleeps {lead.sleeps}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sand-100">{lead.homeCity}</p>
                            <p className="mt-1 font-medium text-amber-glow">{formatMoney(lead.nightlyRateCents)}/night</p>
                          </td>
                          <td className="max-w-xs px-6 py-5">
                            <p className="line-clamp-2 text-sand-200/70">{lead.festivalAvailability}</p>
                            {lead.notes && (
                              <p className="mt-2 line-clamp-1 text-xs text-sand-200/40">{lead.notes}</p>
                            )}
                          </td>
                          <td className="px-6 py-5 text-sand-200/60">{formatSubmittedAt(lead.createdAt)}</td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={`mailto:${lead.email}?subject=${encodeURIComponent('FestyCamper — your van listing')}`}
                                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-sand-100 transition-all hover:border-amber-glow/40"
                              >
                                Contact
                              </a>
                              {lead.photosUrl && (
                                <a
                                  href={lead.photosUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-amber-glow/15 px-4 py-2 text-xs font-semibold text-amber-glow ring-1 ring-amber-glow/30 transition-all hover:bg-amber-glow/25"
                                >
                                  Photos
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid gap-4 lg:hidden">
                  {leads.map((lead) => (
                    <article
                      key={lead.id}
                      className="rounded-3xl border border-white/10 bg-forest-900/60 p-6"
                    >
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
                        {lead.ownerName}
                      </h3>
                      <p className="mt-1 text-sm text-sand-200/60">{lead.email}</p>
                      <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-sand-200/50">Van</dt>
                          <dd className="text-right text-sand-100">{lead.vanYearMakeModel}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-sand-200/50">Rate</dt>
                          <dd className="font-semibold text-amber-glow">{formatMoney(lead.nightlyRateCents)}/night</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-sand-200/50">Festivals</dt>
                          <dd className="text-right text-sand-100">{lead.festivalAvailability}</dd>
                        </div>
                      </dl>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent('FestyCamper — your van listing')}`}
                          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-sand-100"
                        >
                          Contact
                        </a>
                        {lead.photosUrl && (
                          <a
                            href={lead.photosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-amber-glow/15 px-4 py-2 text-xs font-semibold text-amber-glow"
                          >
                            Photos
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

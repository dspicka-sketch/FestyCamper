import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireOwnerSession } from '@/lib/owner/auth';
import { LogoutButton } from '@/components/owner/LogoutButton';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { OwnerVanCard, OwnerVansEmpty } from '@/components/owner/vans/OwnerVanCard';

export default async function OwnerDashboardPage() {
  const { user, owner } = await requireOwnerSession('/owner/dashboard');

  const vans = owner
    ? await prisma.van.findMany({
        where: { ownerId: owner.id },
        include: {
          photos: { orderBy: { sortOrder: 'asc' } },
          festivals: { include: { festival: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      })
    : [];

  const totalVans = owner
    ? await prisma.van.count({ where: { ownerId: owner.id } })
    : 0;

  const activeVans = owner
    ? await prisma.van.count({ where: { ownerId: owner.id, status: 'ACTIVE' } })
    : 0;

  const pendingBookings = owner
    ? await prisma.bookingRequest.count({
        where: { van: { ownerId: owner.id }, status: 'REQUESTED' },
      })
    : 0;

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-amber-glow)_0%,_transparent_45%)] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Owner dashboard</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50">
            Hello{user.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="mt-4 text-lg text-sand-200/70">
            Manage your festival-ready vans, track listing status, and respond to booking requests.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <StatCard label="Total listings" value={String(totalVans)} />
            <StatCard label="Active listings" value={String(activeVans)} />
            <StatCard label="Pending requests" value={String(pendingBookings)} />
            <StatCard label="Paused / draft" value={String(Math.max(totalVans - activeVans, 0))} />
          </div>

          <div className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-forest-900/60 p-6 sm:p-8">
            <p className="text-sm text-sand-200/60">Signed in as {user.email}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/owner/onboarding"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Add your van
              </Link>
              <Link
                href="/owner/vans"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/10"
              >
                Manage listings
              </Link>
              <Link
                href="/owner/bookings"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/10"
              >
                Booking requests{pendingBookings > 0 ? ` (${pendingBookings})` : ''}
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
                Your vans
              </h2>
              {totalVans > 0 && (
                <Link href="/owner/vans" className="text-sm font-semibold text-amber-glow hover:text-amber-glow/80">
                  View all
                </Link>
              )}
            </div>

            {!owner ? (
              <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-6 text-sm text-sand-200/70">
                Complete onboarding to create your first listing.
              </div>
            ) : vans.length === 0 ? (
              <OwnerVansEmpty />
            ) : (
              <div className="space-y-5">
                {vans.map((van) => (
                  <OwnerVanCard key={van.id} van={van} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-sand-200/50">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50">{value}</p>
    </div>
  );
}

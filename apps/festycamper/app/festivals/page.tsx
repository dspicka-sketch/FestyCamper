import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { formatFestivalDates } from '@/lib/dates';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

const FESTIVAL_GRADIENTS = [
  'from-emerald-600/30 via-teal-700/20 to-forest-900',
  'from-amber-600/30 via-orange-700/20 to-forest-900',
  'from-violet-600/30 via-purple-700/20 to-forest-900',
  'from-rose-600/30 via-red-700/20 to-forest-900',
  'from-sky-600/30 via-blue-700/20 to-forest-900',
  'from-orange-600/30 via-amber-700/20 to-forest-900',
];

export default async function FestivalsPage() {
  const festivals = await prisma.festival.findMany({
    orderBy: { startsAt: 'asc' },
    include: {
      vans: {
        where: { van: { status: 'ACTIVE' } },
        select: { vanId: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">All Festivals</p>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
            Find your next festival weekend
          </h1>
          <p className="mt-4 max-w-xl text-lg text-sand-200/70">
            Browse every upcoming drop with real owner vans pre-approved for on-site camping and bundled weekend packages.
          </p>
          <p className="mt-6 text-sm text-sand-200/50">
            {festivals.length} festival{festivals.length === 1 ? '' : 's'} available
          </p>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/40 to-forest-950" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {festivals.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-12 text-center">
              <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
                No festivals yet
              </p>
              <p className="mt-2 text-sand-200/70">Check back soon for upcoming festival drops.</p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 transition-all duration-300 hover:-translate-y-0.5"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {festivals.map((festival, index) => {
                const vanCount = festival.vans.length;
                const hasVans = vanCount > 0;

                return (
                  <article
                    key={festival.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-amber-glow/30 hover:shadow-2xl hover:shadow-amber-glow/10"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${FESTIVAL_GRADIENTS[index % FESTIVAL_GRADIENTS.length]} opacity-60 transition-opacity duration-500 group-hover:opacity-80`}
                    />
                    <div className="relative flex h-full flex-col p-8">
                      <div className="flex items-start justify-between gap-4">
                        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-sand-200/80">
                          {festival.city}, {festival.state}
                        </span>
                        <time dateTime={festival.startsAt.toISOString()} className="text-xs text-sand-200/50">
                          {formatFestivalDates(festival.startsAt, festival.endsAt)}
                        </time>
                      </div>

                      <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50 transition-colors group-hover:text-amber-glow">
                        {festival.name}
                      </h2>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-sand-200/70">
                        {festival.description}
                      </p>

                      <div className="mt-5">
                        {hasVans ? (
                          <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {vanCount} van{vanCount === 1 ? '' : 's'} available
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-sand-200/60">
                            Join waitlist — no vans yet
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/festivals/${festival.slug}`}
                        className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-glow/35"
                      >
                        {hasVans ? 'View vans' : 'Join waitlist'}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

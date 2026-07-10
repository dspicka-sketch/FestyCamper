import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { VanBrowseCard } from '@/components/vans/VanBrowseCard';
import { VanMarketplaceFilters } from '@/components/vans/VanMarketplaceFilters';
import {
  buildVanSearchWhere,
  parseVanSearchParams,
  publicVanListInclude,
} from '@/lib/vans/search';

type VansPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VansPage({ searchParams }: VansPageProps) {
  const params = await searchParams;
  const filters = parseVanSearchParams(params);
  const where = buildVanSearchWhere(filters);

  const [vans, festivals] = await Promise.all([
    prisma.van.findMany({
      where,
      include: publicVanListInclude,
      orderBy: [{ nightlyRateCents: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.festival.findMany({
      orderBy: { startsAt: 'asc' },
      select: { slug: true, name: true },
    }),
  ]);

  const initialFilters = {
    festival: filters.festival,
    sleeps: filters.sleeps?.toString(),
    priceMin: filters.priceMin !== undefined ? String(Math.round(filters.priceMin / 100)) : undefined,
    priceMax: filters.priceMax !== undefined ? String(Math.round(filters.priceMax / 100)) : undefined,
    amenities: filters.amenities,
    transmission: filters.transmission,
    petFriendly: filters.petFriendly,
  };

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-amber-glow)_0%,_transparent_45%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-32 sm:px-8 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Marketplace</p>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
            Browse festival-ready vans
          </h1>
          <p className="mt-4 max-w-xl text-lg text-sand-200/70">
            Filter by festival, capacity, price, amenities, and more. Every listing is owner-verified and active.
          </p>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/30 to-forest-950" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<div className="rounded-3xl border border-white/10 bg-forest-900/60 p-5">Loading filters…</div>}>
            <VanMarketplaceFilters
              festivals={festivals}
              initial={initialFilters}
              resultCount={vans.length}
            />
          </Suspense>

          <div>
            <p className="mb-6 hidden text-sm text-sand-200/60 lg:block">
              {vans.length} active van{vans.length === 1 ? '' : 's'} match your filters
            </p>

            {vans.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-forest-900/40 px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-glow/10 text-2xl">
                  🔍
                </div>
                <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
                  No vans match your filters
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-sand-200/60">
                  Try adjusting your filters or browse festivals to see upcoming availability.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/vans"
                    className="inline-flex rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-sand-100"
                  >
                    Clear filters
                  </Link>
                  <Link
                    href="/festivals"
                    className="inline-flex rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950"
                  >
                    Browse festivals
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {vans.map((van) => (
                  <VanBrowseCard key={van.id} van={van} selectedFestival={filters.festival} />
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

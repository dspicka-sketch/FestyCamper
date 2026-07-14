import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { resolveFestivalSlug } from '@/lib/festivals/catalog';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { FestivalHero } from '@/components/festivals/FestivalHero';
import { FestivalVanCard, FestivalVansEmpty } from '@/components/festivals/FestivalVanCard';
import { FestivalWeekendPlan } from '@/components/festivals/FestivalWeekendPlan';

export default async function FestivalPage({ params }: PageProps<'/festivals/[slug]'>) {
  const { slug } = await params;
  const canonicalSlug = resolveFestivalSlug(slug);

  if (canonicalSlug !== slug) {
    redirect(`/festivals/${canonicalSlug}`);
  }

  const festival = await prisma.festival.findUnique({
    where: { slug: canonicalSlug },
    include: {
      vans: {
        where: { van: { status: 'ACTIVE' } },
        include: {
          van: {
            include: {
              photos: { orderBy: { sortOrder: 'asc' } },
            },
          },
        },
      },
    },
  });

  if (!festival) return notFound();

  const activeVans = festival.vans.map(({ van }) => van);

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <FestivalHero
        slug={festival.slug}
        name={festival.name}
        city={festival.city}
        state={festival.state}
        startsAt={festival.startsAt}
        endsAt={festival.endsAt}
        vanCount={activeVans.length}
      />

      <FestivalWeekendPlan
        name={festival.name}
        description={festival.description}
        campNotes={festival.campNotes}
      />

      <section id="available-vans" className="relative scroll-mt-24 py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/40 to-forest-950" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Available vans</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
                Festival-approved listings
              </h2>
            </div>
            <Link
              href={`/vans?festival=${festival.slug}`}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-sand-100 transition-colors hover:border-amber-glow/40"
            >
              Browse all with filters
            </Link>
          </div>

          {activeVans.length === 0 ? (
            <FestivalVansEmpty festivalName={festival.name} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeVans.map((van) => (
                <FestivalVanCard key={van.id} van={van} festivalSlug={festival.slug} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

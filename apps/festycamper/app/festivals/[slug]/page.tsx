import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatFestivalDates } from '@/lib/dates';
import { resolveFestivalSlug } from '@/lib/festivals/catalog';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { FestivalVanCard, FestivalVansEmpty } from '@/components/festivals/FestivalVanCard';

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

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-32 sm:px-8 sm:pt-36">
          <Link href="/festivals" className="text-sm font-medium text-amber-glow hover:text-amber-glow/80">
            ← All festivals
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-sand-200/80">
              {festival.city}, {festival.state}
            </span>
            <time dateTime={festival.startsAt.toISOString()} className="text-xs text-sand-200/50">
              {formatFestivalDates(festival.startsAt, festival.endsAt)}
            </time>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              {activeVans.length} van{activeVans.length === 1 ? '' : 's'} available
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
            {festival.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sand-200/70">{festival.description}</p>
          <p className="mt-4 max-w-2xl text-sm text-sand-200/60">{festival.campNotes}</p>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
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

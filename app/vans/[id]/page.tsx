import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatMoney } from '@/lib/pricing';
import { FESTIVAL_OPTIONS } from '@/lib/owner/onboarding-constants';
import { resolveFestivalSlug } from '@/lib/festivals/catalog';
import {
  getFestivalLabels,
  getVehicleTitle,
  parseAmenityLabels,
} from '@/lib/owner/van-display';
import { publicVanDetailInclude } from '@/lib/vans/search';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { VanGallery } from '@/components/vans/VanGallery';
import { PublicVanBooking } from '@/components/vans/PublicVanBooking';

type PublicVanPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PublicVanPage({ params, searchParams }: PublicVanPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const festivalParam = typeof query.festival === 'string' ? resolveFestivalSlug(query.festival) : undefined;

  const van = await prisma.van.findUnique({
    where: { id },
    include: publicVanDetailInclude,
  });

  if (!van || van.status !== 'ACTIVE') {
    notFound();
  }

  const bundles = await prisma.bundle.findMany({ orderBy: { priceCents: 'asc' } });
  const bookableFestivals = van.festivals.map(({ festival }) => festival);

  const preselectedFestival = festivalParam
    ? bookableFestivals.find((f) => f.slug === festivalParam)
    : undefined;

  const amenityLabels = parseAmenityLabels(van.amenities);
  const festivalLabels = getFestivalLabels(van);
  const storedFestivals = van.availableFestivals?.split(',').filter(Boolean) ?? [];
  const storedFestivalNames = storedFestivals.map(
    (festivalId) => FESTIVAL_OPTIONS.find((f) => f.id === festivalId)?.name ?? festivalId,
  );

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
          <Link href="/vans" className="text-sm font-medium text-amber-glow hover:text-amber-glow/80">
            ← Browse vans
          </Link>

          {preselectedFestival && (
            <p className="mt-4 inline-flex rounded-full border border-amber-glow/30 bg-amber-glow/10 px-3 py-1 text-xs font-semibold text-amber-glow">
              Booking for {preselectedFestival.name}
            </p>
          )}

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <VanGallery
                photos={van.photos.map((photo) => ({
                  id: photo.id,
                  publicUrl: photo.publicUrl,
                  isCover: photo.isCover,
                }))}
                title={getVehicleTitle(van)}
              />

              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Festival-ready van</p>
                <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50">
                  {getVehicleTitle(van)}
                </h1>
                {van.trim && <p className="mt-2 text-lg text-sand-200/70">{van.trim}</p>}
                <p className="mt-3 text-sm text-sand-200/60">{van.location}</p>
                <p className="mt-5 text-base leading-relaxed text-sand-200/80">{van.description}</p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DetailCard label="Sleeps" value={String(van.sleeps)} />
                <DetailCard label="Seatbelts" value={String(van.seatbelts ?? van.sleeps)} />
                <DetailCard label="Transmission" value={van.transmission ?? '—'} />
                <DetailCard label="Fuel" value={van.fuelType ?? '—'} />
              </div>

              <section className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {amenityLabels.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-sand-100"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Festival availability</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(festivalLabels.length > 0 ? festivalLabels : storedFestivalNames).map((festival) => (
                    <span
                      key={festival}
                      className="rounded-full border border-amber-glow/30 bg-amber-glow/10 px-3 py-1.5 text-sm font-medium text-amber-glow"
                    >
                      {festival}
                    </span>
                  ))}
                </div>
              </section>

              {van.rules && (
                <section className="mt-10 rounded-2xl border border-white/10 bg-forest-900/60 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-sand-200/60">Rules</h2>
                  <p className="mt-3 text-sm leading-relaxed text-sand-200/80">{van.rules}</p>
                </section>
              )}
            </div>

            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-6">
                <p className="text-sm text-sand-200/60">Nightly rate</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-semibold text-amber-glow">
                  {formatMoney(van.nightlyRateCents)}
                </p>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-sand-200/60">Cleaning fee</dt>
                    <dd className="font-medium text-sand-100">{formatMoney(van.cleaningFeeCents)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-sand-200/60">Security deposit</dt>
                    <dd className="font-medium text-sand-100">{formatMoney(van.securityDepositCents)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-sand-200/60">Minimum nights</dt>
                    <dd className="font-medium text-sand-100">{van.minNights}</dd>
                  </div>
                  {van.weekendRateCents && (
                    <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                      <dt className="text-sand-200/60">Weekend premium</dt>
                      <dd className="font-medium text-sand-100">+{formatMoney(van.weekendRateCents)}/night</dd>
                    </div>
                  )}
                </dl>
              </div>

              <PublicVanBooking
                vanId={van.id}
                festivals={bookableFestivals}
                bundles={bundles}
                defaultFestivalId={preselectedFestival?.id}
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-sand-200/50">{label}</p>
      <p className="mt-2 text-lg font-semibold text-sand-50">{value}</p>
    </div>
  );
}

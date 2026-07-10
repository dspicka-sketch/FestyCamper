import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireOwnerSession, getVanForOwner } from '@/lib/owner/auth';
import { FESTIVAL_OPTIONS } from '@/lib/owner/onboarding-constants';
import { getStoredFestivalIds, getVehicleTitle, labelsToAmenityIds } from '@/lib/owner/van-display';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { VanEditForm } from '@/components/owner/vans/VanEditForm';
import { VanStatusBadge } from '@/components/owner/vans/VanStatusBadge';

export default async function EditOwnerVanPage({ params }: PageProps<'/owner/vans/[id]/edit'>) {
  const { id } = await params;
  const { owner } = await requireOwnerSession(`/owner/vans/${id}/edit`);

  if (!owner) {
    redirect('/owner/onboarding');
  }

  const van = await getVanForOwner(id, owner.id);
  if (!van) {
    notFound();
  }

  const festivalIds = getStoredFestivalIds(van);
  const fallbackFestivals = van.festivals
    .map(({ festival }) => festival.slug)
    .flatMap((slug) => {
      const match = FESTIVAL_OPTIONS.find((f) => f.dbSlug === slug);
      return match ? [match.id] : [];
    });

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
          <div className="mb-8">
            <Link href="/owner/vans" className="text-sm font-medium text-amber-glow hover:text-amber-glow/80">
              ← Back to listings
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50">
                Edit {getVehicleTitle(van)}
              </h1>
              <VanStatusBadge status={van.status} />
            </div>
            <p className="mt-3 text-lg text-sand-200/70">
              Update your listing details. Photos and festival links are preserved unless you change festival availability.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-6 sm:p-8">
            <VanEditForm
              vanId={van.id}
              initial={{
                year: String(van.year ?? ''),
                make: van.make ?? '',
                model: van.model ?? '',
                trim: van.trim ?? '',
                sleeps: String(van.sleeps),
                seatbelts: String(van.seatbelts ?? van.sleeps),
                transmission: van.transmission ?? 'Automatic',
                fuelType: van.fuelType ?? 'Gasoline',
                location: van.location,
                amenities: labelsToAmenityIds(van.amenities),
                festivals: festivalIds.length > 0 ? festivalIds : [...new Set(fallbackFestivals)],
                nightlyRate: String(Math.round(van.nightlyRateCents / 100)),
                cleaningFee: String(Math.round(van.cleaningFeeCents / 100)),
                securityDeposit: String(Math.round(van.securityDepositCents / 100)),
                minNights: String(van.minNights),
                weekendPricing: Boolean(van.weekendRateCents),
                weekendPremium: van.weekendRateCents ? String(Math.round(van.weekendRateCents / 100)) : '50',
                photos: van.photos.map((photo) => ({
                  id: photo.id,
                  publicUrl: photo.publicUrl,
                  isCover: photo.isCover,
                })),
              }}
            />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

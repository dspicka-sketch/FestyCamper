import Link from 'next/link';
import { formatMoney } from '@/lib/pricing';
import { getCoverPhotoUrl, getVehicleTitle, parseAmenityLabels } from '@/lib/owner/van-display';
import { getVanCity } from '@/lib/vans/search';
import type { Festival, Van, VanPhoto } from '@prisma/client';

type FestivalVanCardProps = {
  van: Van & { photos: VanPhoto[] };
  festivalSlug: string;
};

export function FestivalVanCard({ van, festivalSlug }: FestivalVanCardProps) {
  const coverUrl = getCoverPhotoUrl(van);
  const amenities = parseAmenityLabels(van.amenities).slice(0, 4);
  const city = getVanCity(van.location);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 transition-all duration-300 hover:border-amber-glow/30 hover:shadow-xl hover:shadow-black/20">
      <div className="relative aspect-[16/10] bg-forest-800">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={getVehicleTitle(van)} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-sand-200/20">🚐</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white">
          Festival approved
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
          {getVehicleTitle(van)}
        </h3>
        <p className="mt-2 text-sm text-sand-200/60">
          Sleeps {van.sleeps} · {city}
        </p>
        <p className="mt-3 text-lg font-bold text-amber-glow">
          {formatMoney(van.nightlyRateCents)}
          <span className="text-sm font-normal text-sand-200/50"> / night</span>
        </p>

        {amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-sand-200/80"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/vans/${van.id}?festival=${festivalSlug}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          View Van
        </Link>
      </div>
    </article>
  );
}

export function FestivalVansEmpty({ festivalName }: { festivalName: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-forest-900/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-glow/10 text-2xl">
        🎪
      </div>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
        No vans available yet
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-sand-200/60">
        There are no active listings for {festivalName} right now. Join the waitlist and we&apos;ll notify you when
        vans become available.
      </p>
      <Link
        href="/list-your-van"
        className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-sand-100 transition-colors hover:border-amber-glow/40"
      >
        Join waitlist — list your van
      </Link>
    </div>
  );
}

export type FestivalWithVanCount = Festival & {
  vans: { van: Van & { photos: VanPhoto[] } }[];
};

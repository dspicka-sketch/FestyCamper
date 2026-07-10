import Link from 'next/link';
import { formatMoney } from '@/lib/pricing';
import { getCoverPhotoUrl, getVehicleTitle, parseAmenityLabels } from '@/lib/owner/van-display';
import { getVanCity } from '@/lib/vans/search';
import type { Festival, Van, VanPhoto } from '@prisma/client';

type VanBrowseCardProps = {
  van: Van & {
    photos: VanPhoto[];
    festivals: { festival: Pick<Festival, 'name' | 'slug'> }[];
  };
  selectedFestival?: string;
};

export function VanBrowseCard({ van, selectedFestival }: VanBrowseCardProps) {
  const coverUrl = getCoverPhotoUrl(van);
  const amenities = parseAmenityLabels(van.amenities).slice(0, 3);
  const festivalNames = van.festivals.map(({ festival }) => festival.name).slice(0, 2);
  const href = selectedFestival
    ? `/vans/${van.id}?festival=${selectedFestival}`
    : `/vans/${van.id}`;

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-amber-glow/30 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="relative aspect-[4/3] bg-forest-800">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={getVehicleTitle(van)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-sand-200/20">🚐</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50 group-hover:text-amber-glow">
          {getVehicleTitle(van)}
        </h3>
        <p className="mt-1 text-sm text-sand-200/60">
          {getVanCity(van.location)} · Sleeps {van.sleeps}
          {van.transmission ? ` · ${van.transmission}` : ''}
        </p>
        <p className="mt-3 text-lg font-bold text-amber-glow">
          {formatMoney(van.nightlyRateCents)}
          <span className="text-sm font-normal text-sand-200/50"> / night</span>
        </p>
        {festivalNames.length > 0 && (
          <p className="mt-2 text-xs text-sand-200/50">{festivalNames.join(' · ')}</p>
        )}
        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {amenities.map((amenity) => (
              <span key={amenity} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-sand-200/70">
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

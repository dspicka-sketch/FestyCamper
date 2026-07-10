import type { Festival, Van, VanPhoto } from '@prisma/client';
import { formatMoney } from '@/lib/pricing';
import {
  formatVanDate,
  getCoverPhotoUrl,
  getFestivalLabels,
  getVehicleTitle,
} from '@/lib/owner/van-display';
import { VanStatusBadge } from '@/components/owner/vans/VanStatusBadge';
import { VanListingActions } from '@/components/owner/vans/VanListingActions';

type OwnerVanCardProps = {
  van: Van & {
    photos: VanPhoto[];
    festivals: { festival: Festival }[];
  };
};

export function OwnerVanCard({ van }: OwnerVanCardProps) {
  const coverUrl = getCoverPhotoUrl(van);
  const festivals = getFestivalLabels(van);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 transition-colors hover:border-white/15">
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        <div className="relative aspect-[4/3] bg-forest-800 sm:aspect-auto sm:min-h-[180px]">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt={getVehicleTitle(van)} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[180px] items-center justify-center text-4xl text-sand-200/30">
              🚐
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <VanStatusBadge status={van.status} />
              <span className="text-xs text-sand-200/50">Listed {formatVanDate(van.createdAt)}</span>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
              {getVehicleTitle(van)}
            </h2>
            {van.trim && <p className="mt-1 text-sm text-sand-200/60">{van.trim}</p>}
            <p className="mt-3 text-lg font-semibold text-amber-glow">
              {formatMoney(van.nightlyRateCents)}
              <span className="text-sm font-normal text-sand-200/50"> / night</span>
            </p>
            <p className="mt-3 text-sm text-sand-200/70">
              <span className="font-medium text-sand-100">Festivals:</span>{' '}
              {festivals.join(' · ')}
            </p>
          </div>

          <div className="mt-5">
            <VanListingActions vanId={van.id} status={van.status} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function OwnerVansEmpty() {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-forest-900/40 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-glow/10 text-2xl">
        🚐
      </div>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
        No vans listed yet
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-sand-200/60">
        Add your first festival-ready van to start receiving booking requests from renters.
      </p>
    </div>
  );
}

export function OwnerVansError() {
  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-6 py-10 text-center">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-rose-100">
        Unable to load your listings
      </h2>
      <p className="mt-2 text-sm text-rose-200/80">
        Please refresh the page. If the problem continues, sign out and sign back in.
      </p>
    </div>
  );
}

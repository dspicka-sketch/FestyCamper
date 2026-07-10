import { AMENITY_OPTIONS, FESTIVAL_OPTIONS } from '@/lib/owner/onboarding-constants';
import type { Festival, Van, VanPhoto } from '@prisma/client';

export function getVehicleTitle(van: Pick<Van, 'year' | 'make' | 'model' | 'name'>) {
  const parts = [van.year, van.make, van.model].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : van.name;
}

export function getFestivalLabels(van: Pick<Van, 'availableFestivals'> & { festivals?: { festival: Festival }[] }) {
  const fromDb = van.festivals?.map(({ festival }) => festival.name) ?? [];
  const fromStored =
    van.availableFestivals
      ?.split(',')
      .filter(Boolean)
      .map((id) => FESTIVAL_OPTIONS.find((f) => f.id === id)?.name ?? id) ?? [];

  return [...new Set([...fromDb, ...fromStored])];
}

export function getCoverPhotoUrl(van: Pick<Van, 'coverPhotoUrl'> & { photos?: VanPhoto[] }) {
  return van.coverPhotoUrl ?? van.photos?.find((p) => p.isCover)?.publicUrl ?? van.photos?.[0]?.publicUrl ?? null;
}

export function getStatusMeta(status: Van['status']) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Active', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' };
    case 'PAUSED':
      return { label: 'Paused', className: 'border-amber-glow/30 bg-amber-glow/10 text-amber-glow' };
    default:
      return { label: 'Draft', className: 'border-white/15 bg-white/5 text-sand-200/60' };
  }
}

export function parseAmenityLabels(amenities: string) {
  return amenities
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function labelsToAmenityIds(amenities: string): string[] {
  const labels = parseAmenityLabels(amenities);
  return labels.map((label) => {
    const match = AMENITY_OPTIONS.find((a) => a.label === label);
    return match?.id ?? label;
  });
}

export function amenityIdsToLabels(ids: string[]) {
  return ids.map((id) => AMENITY_OPTIONS.find((a) => a.id === id)?.label ?? id).join(', ');
}

export function getStoredFestivalIds(van: Pick<Van, 'availableFestivals'>) {
  return van.availableFestivals?.split(',').filter(Boolean) ?? [];
}

export function formatVanDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

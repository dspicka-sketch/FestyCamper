import type { Prisma } from '@prisma/client';
import { AMENITY_OPTIONS } from '@/lib/owner/onboarding-constants';
import { resolveFestivalSlug } from '@/lib/festivals/catalog';

export type VanSearchFilters = {
  festival?: string;
  sleeps?: number;
  priceMin?: number;
  priceMax?: number;
  amenities: string[];
  transmission?: string;
  petFriendly?: boolean;
};

export function parseVanSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): VanSearchFilters {
  const get = (key: string) => {
    const value = searchParams[key];
    return typeof value === 'string' ? value : undefined;
  };

  const sleeps = get('sleeps');
  const priceMin = get('priceMin');
  const priceMax = get('priceMax');
  const festival = get('festival');
  const amenitiesRaw = get('amenities');
  const transmission = get('transmission');
  const petFriendly = get('petFriendly');

  return {
    festival: festival ? resolveFestivalSlug(festival) : undefined,
    sleeps: sleeps ? parseInt(sleeps, 10) : undefined,
    priceMin: priceMin ? parseInt(priceMin, 10) * 100 : undefined,
    priceMax: priceMax ? parseInt(priceMax, 10) * 100 : undefined,
    amenities: amenitiesRaw ? amenitiesRaw.split(',').filter(Boolean) : [],
    transmission: transmission || undefined,
    petFriendly: petFriendly === '1' || petFriendly === 'true',
  };
}

function amenityLabel(id: string) {
  return AMENITY_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

export function buildVanSearchWhere(filters: VanSearchFilters): Prisma.VanWhereInput {
  const where: Prisma.VanWhereInput = { status: 'ACTIVE' };

  if (filters.festival) {
    where.festivals = {
      some: { festival: { slug: filters.festival } },
    };
  }

  if (filters.sleeps && !Number.isNaN(filters.sleeps)) {
    where.sleeps = { gte: filters.sleeps };
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.nightlyRateCents = {
      ...(filters.priceMin !== undefined ? { gte: filters.priceMin } : {}),
      ...(filters.priceMax !== undefined ? { lte: filters.priceMax } : {}),
    };
  }

  if (filters.transmission) {
    where.transmission = filters.transmission;
  }

  const amenityConditions: Prisma.VanWhereInput[] = [];

  if (filters.petFriendly) {
    amenityConditions.push({ amenities: { contains: 'Pet Friendly', mode: 'insensitive' } });
  }

  for (const amenityId of filters.amenities) {
    if (amenityId === 'pet-friendly') continue;
    const label = amenityLabel(amenityId);
    amenityConditions.push({ amenities: { contains: label, mode: 'insensitive' } });
  }

  if (amenityConditions.length > 0) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      ...amenityConditions,
    ];
  }

  return where;
}

export const publicVanListInclude = {
  photos: { orderBy: { sortOrder: 'asc' as const } },
  festivals: { include: { festival: { select: { id: true, name: true, slug: true, city: true, state: true } } } },
} satisfies Prisma.VanInclude;

export const publicVanDetailInclude = {
  photos: { orderBy: { sortOrder: 'asc' as const } },
  festivals: { include: { festival: { select: { id: true, name: true, slug: true, city: true, state: true } } } },
} satisfies Prisma.VanInclude;

/** Extract display city from van location — never expose owner PII */
export function getVanCity(location: string) {
  const city = location.split(',')[0]?.trim();
  return city || location;
}

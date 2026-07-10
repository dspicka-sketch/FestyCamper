export type BeachAccess = "sandy" | "rocky" | "jetty" | "gulch" | "mixed";

export interface SurfLocation {
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  access: BeachAccess;
  description: string;
  /** Exposed to NW swell */
  swellExposure: number;
  /** Wind shelter factor 0-1 */
  windShelter: number;
}

/**
 * Sonoma Coast beta locations. Salmon Creek is intentionally excluded.
 */
export const SURF_LOCATIONS: SurfLocation[] = [
  {
    id: "loc_doran_beach",
    slug: "doran-beach",
    name: "Doran Beach",
    latitude: 38.3269,
    longitude: -123.0528,
    access: "sandy",
    description: "Protected Bodega Harbor beach with sandy surf perch and halibut opportunities.",
    swellExposure: 0.45,
    windShelter: 0.7,
  },
  {
    id: "loc_doran_jetty",
    slug: "doran-jetty",
    name: "Doran Jetty",
    latitude: 38.3189,
    longitude: -123.0489,
    access: "jetty",
    description: "Rocky jetty structure for perch, rockfish, and occasional striped bass.",
    swellExposure: 0.55,
    windShelter: 0.65,
  },
  {
    id: "loc_dillon_beach",
    slug: "dillon-beach",
    name: "Dillon Beach",
    latitude: 38.2503,
    longitude: -122.9639,
    access: "sandy",
    description: "Open Tomales Bay mouth beach with perch and surf smelt runs.",
    swellExposure: 0.85,
    windShelter: 0.35,
  },
  {
    id: "loc_portuguese_beach",
    slug: "portuguese-beach",
    name: "Portuguese Beach",
    latitude: 38.4012,
    longitude: -123.1167,
    access: "rocky",
    description: "Rocky Sonoma Coast pocket beach with perch and cabezon potential.",
    swellExposure: 0.9,
    windShelter: 0.25,
  },
  {
    id: "loc_wrights_beach",
    slug: "wrights-beach",
    name: "Wrights Beach",
    latitude: 38.3778,
    longitude: -123.1011,
    access: "sandy",
    description: "Campground beach with sandy surf and perch fishing on incoming tides.",
    swellExposure: 0.88,
    windShelter: 0.3,
  },
  {
    id: "loc_shorttail_gulch",
    slug: "shorttail-gulch",
    name: "Shorttail Gulch",
    latitude: 38.385,
    longitude: -123.105,
    access: "gulch",
    description: "Steep gulch access to a rocky pocket cove — perch and rockfish.",
    swellExposure: 0.92,
    windShelter: 0.4,
  },
  {
    id: "loc_pinnacle_gulch",
    slug: "pinnacle-gulch",
    name: "Pinnacle Gulch",
    latitude: 38.382,
    longitude: -123.102,
    access: "gulch",
    description: "Scenic gulch trail to rocky shoreline with perch and cabezon habitat.",
    swellExposure: 0.91,
    windShelter: 0.38,
  },
  {
    id: "loc_duncans_cove",
    slug: "duncans-cove",
    name: "Duncan's Cove",
    latitude: 38.378,
    longitude: -123.098,
    access: "gulch",
    description: "Protected cove access with mixed sand and rock — perch and rockfish.",
    swellExposure: 0.75,
    windShelter: 0.55,
  },
];

export const LOCATION_BY_SLUG = Object.fromEntries(
  SURF_LOCATIONS.map((loc) => [loc.slug, loc]),
) as Record<string, SurfLocation>;

export const LOCATION_BY_ID = Object.fromEntries(
  SURF_LOCATIONS.map((loc) => [loc.id, loc]),
) as Record<string, SurfLocation>;

export function getLocationBySlug(slug: string): SurfLocation | undefined {
  return LOCATION_BY_SLUG[slug];
}

export function getLocationById(id: string): SurfLocation | undefined {
  return LOCATION_BY_ID[id];
}

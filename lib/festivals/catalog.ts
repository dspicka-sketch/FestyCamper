export const FESTIVAL_CATALOG = [
  {
    id: 'coachella',
    slug: 'coachella',
    name: 'Coachella',
    city: 'Indio',
    state: 'CA',
    startsAt: new Date('2027-04-09'),
    endsAt: new Date('2027-04-12'),
    description: 'Desert festival camping with premium van packages and delivery options.',
    campNotes: 'Best for renters who want shade, solar, bedding, and turnkey setup.',
    gradient: 'from-rose-500/30 via-orange-500/20 to-amber-500/30',
  },
  {
    id: 'burning-man',
    slug: 'burning-man',
    name: 'Burning Man',
    city: 'Black Rock City',
    state: 'NV',
    startsAt: new Date('2027-08-24'),
    endsAt: new Date('2027-09-01'),
    description: 'Radical self-reliance meets turnkey camp setups for the playa.',
    campNotes: 'Recommend solar, dust mitigation, extra water, and shade structures.',
    gradient: 'from-orange-600/30 via-amber-500/20 to-yellow-500/30',
  },
  {
    id: 'outside-lands',
    slug: 'outside-lands',
    name: 'Outside Lands',
    city: 'San Francisco',
    state: 'CA',
    startsAt: new Date('2027-08-07'),
    endsAt: new Date('2027-08-09'),
    description: 'Golden Gate Park festival camping with fog-friendly van setups.',
    campNotes: 'Layered bedding, heaters, and compact rigs work best in the park.',
    gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/30',
  },
  {
    id: 'portola',
    slug: 'portola',
    name: 'Portola',
    city: 'San Francisco',
    state: 'CA',
    startsAt: new Date('2027-09-25'),
    endsAt: new Date('2027-09-27'),
    description: 'Electronic music festival vans with urban pickup and curated camp gear.',
    campNotes: 'Great for groups wanting lounge space, power, and late-night comfort.',
    gradient: 'from-violet-500/30 via-purple-500/20 to-fuchsia-500/30',
  },
  {
    id: 'lightning-in-a-bottle',
    slug: 'lightning-in-a-bottle',
    name: 'Lightning in a Bottle',
    city: 'Buena Vista Lake',
    state: 'CA',
    startsAt: new Date('2027-05-19'),
    endsAt: new Date('2027-05-24'),
    description: 'Festival-friendly vans for long weekend camping and group setups.',
    campNotes: 'Recommend solar, dust mats, shade canopy, and extra water package.',
    gradient: 'from-sky-500/30 via-blue-500/20 to-indigo-500/30',
  },
  {
    id: 'stagecoach',
    slug: 'stagecoach',
    name: 'Stagecoach',
    city: 'Indio',
    state: 'CA',
    startsAt: new Date('2027-04-23'),
    endsAt: new Date('2027-04-26'),
    description: 'Country festival van camping with roomy rigs and desert-ready amenities.',
    campNotes: 'Shade, coolers, and comfortable sleeping setups are essential in the desert heat.',
    gradient: 'from-amber-500/30 via-yellow-500/20 to-orange-400/30',
  },
] as const;

export type FestivalCatalogEntry = (typeof FESTIVAL_CATALOG)[number];

export function getFestivalBySlug(slug: string) {
  return FESTIVAL_CATALOG.find((f) => f.slug === slug || f.id === slug);
}

/** Legacy slugs that should map to a catalog entry */
export const LEGACY_FESTIVAL_SLUGS: Record<string, string> = {
  'coachella-weekend-1': 'coachella',
};

export function resolveFestivalSlug(slug: string) {
  return LEGACY_FESTIVAL_SLUGS[slug] ?? slug;
}

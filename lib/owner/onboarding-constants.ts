export const ONBOARDING_STEPS = [
  { id: 1, label: 'Vehicle', short: 'Vehicle' },
  { id: 2, label: 'Photos', short: 'Photos' },
  { id: 3, label: 'Amenities', short: 'Amenities' },
  { id: 4, label: 'Festivals', short: 'Festivals' },
  { id: 5, label: 'Pricing', short: 'Pricing' },
  { id: 6, label: 'Review', short: 'Review' },
] as const;

export const AMENITY_OPTIONS = [
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'solar', label: 'Solar', icon: '☀️' },
  { id: 'toilet', label: 'Toilet', icon: '🚽' },
  { id: 'shower', label: 'Shower', icon: '🚿' },
  { id: 'air-conditioning', label: 'Air Conditioning', icon: '❄️' },
  { id: 'heating', label: 'Heating', icon: '🔥' },
  { id: 'awning', label: 'Awning', icon: '⛺' },
  { id: 'bike-rack', label: 'Bike Rack', icon: '🚲' },
  { id: 'starlink', label: 'Starlink', icon: '📡' },
  { id: 'pet-friendly', label: 'Pet Friendly', icon: '🐾' },
] as const;

export const FESTIVAL_OPTIONS = [
  {
    id: 'coachella',
    name: 'Coachella',
    location: 'Indio, CA',
    gradient: 'from-rose-500/30 via-orange-500/20 to-amber-500/30',
    dbSlug: 'coachella-weekend-1',
  },
  {
    id: 'burning-man',
    name: 'Burning Man',
    location: 'Black Rock City, NV',
    gradient: 'from-orange-600/30 via-amber-500/20 to-yellow-500/30',
    dbSlug: null,
  },
  {
    id: 'outside-lands',
    name: 'Outside Lands',
    location: 'San Francisco, CA',
    gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/30',
    dbSlug: null,
  },
  {
    id: 'portola',
    name: 'Portola',
    location: 'San Francisco, CA',
    gradient: 'from-violet-500/30 via-purple-500/20 to-fuchsia-500/30',
    dbSlug: null,
  },
  {
    id: 'lightning-in-a-bottle',
    name: 'Lightning in a Bottle',
    location: 'Buena Vista Lake, CA',
    gradient: 'from-sky-500/30 via-blue-500/20 to-indigo-500/30',
    dbSlug: 'lightning-in-a-bottle',
  },
  {
    id: 'stagecoach',
    name: 'Stagecoach',
    location: 'Indio, CA',
    gradient: 'from-amber-500/30 via-yellow-500/20 to-orange-400/30',
    dbSlug: null,
  },
] as const;

export const TRANSMISSION_OPTIONS = ['Automatic', 'Manual'] as const;

export const FUEL_TYPE_OPTIONS = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'] as const;

export const VAN_PHOTOS_BUCKET = 'van-photos';

export const CURRENT_YEAR = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i);

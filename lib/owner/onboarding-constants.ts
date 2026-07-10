import { FESTIVAL_CATALOG } from '@/lib/festivals/catalog';

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

export const FESTIVAL_OPTIONS = FESTIVAL_CATALOG.map((f) => ({
  id: f.id,
  name: f.name,
  location: `${f.city}, ${f.state}`,
  gradient: f.gradient,
  dbSlug: f.slug,
}));

export const TRANSMISSION_OPTIONS = ['Automatic', 'Manual'] as const;

export const FUEL_TYPE_OPTIONS = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'] as const;

export const VAN_PHOTOS_BUCKET = 'van-photos';

export const CURRENT_YEAR = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i);

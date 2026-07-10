'use client';

import { AMENITY_OPTIONS } from '@/lib/owner/onboarding-constants';

type StepAmenitiesProps = {
  selected: string[];
  onChange: (amenities: string[]) => void;
};

export function StepAmenities({ selected, onChange }: StepAmenitiesProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((a) => a !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-sand-200/60">
        Select everything your van includes. Renters filter by these amenities at festival time.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AMENITY_OPTIONS.map((amenity) => {
          const isSelected = selected.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggle(amenity.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 ${
                isSelected
                  ? 'border-amber-glow/50 bg-amber-glow/10 shadow-lg shadow-amber-glow/10'
                  : 'border-white/10 bg-forest-950/40 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <span className="text-2xl">{amenity.icon}</span>
              <span
                className={`text-sm font-medium ${isSelected ? 'text-amber-glow' : 'text-sand-100'}`}
              >
                {amenity.label}
              </span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                  isSelected
                    ? 'border-amber-glow bg-amber-glow text-forest-950'
                    : 'border-white/20 bg-transparent text-transparent'
                }`}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function validateAmenities(selected: string[]): string | null {
  if (selected.length === 0) return 'Select at least one amenity.';
  return null;
}

'use client';

import { FESTIVAL_OPTIONS } from '@/lib/owner/onboarding-constants';

type StepFestivalsProps = {
  selected: string[];
  onChange: (festivals: string[]) => void;
};

export function StepFestivals({ selected, onChange }: StepFestivalsProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-sand-200/60">
        Choose the festivals where your van is available. You can update availability anytime from your
        dashboard.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {FESTIVAL_OPTIONS.map((festival) => {
          const isSelected = selected.includes(festival.id);
          return (
            <button
              key={festival.id}
              type="button"
              onClick={() => toggle(festival.id)}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-amber-glow/50 bg-forest-950/80 shadow-lg shadow-amber-glow/10 ring-1 ring-amber-glow/20'
                  : 'border-white/10 bg-forest-950/40 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${festival.gradient} opacity-40 transition-opacity group-hover:opacity-60`}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
                      {festival.name}
                    </h3>
                    <p className="mt-1 text-sm text-sand-200/60">{festival.location}</p>
                  </div>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                      isSelected
                        ? 'border-amber-glow bg-amber-glow text-forest-950'
                        : 'border-white/25 bg-black/20 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </div>
                {isSelected && (
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-amber-glow">
                    Available
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function validateFestivals(selected: string[]): string | null {
  if (selected.length === 0) return 'Select at least one festival.';
  return null;
}

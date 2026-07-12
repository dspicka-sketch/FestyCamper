'use client';

import { useState } from 'react';

type GalleryPhoto = {
  id: string;
  publicUrl: string;
  isCover: boolean;
};

export function VanGallery({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const sorted = [...photos].sort((a, b) => Number(b.isCover) - Number(a.isCover));
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex] ?? sorted[0];

  if (!active) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-3xl border border-white/10 bg-forest-900/60 text-5xl text-sand-200/30">
        🚐
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active.publicUrl} alt={title} className="aspect-[16/10] w-full object-cover" />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sorted.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border ${
                index === activeIndex ? 'border-amber-glow ring-2 ring-amber-glow/30' : 'border-white/10'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.publicUrl} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

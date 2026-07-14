'use client';

import { useEffect, useState } from 'react';

type FestivalAnticipationCueProps = {
  startsAt: string;
  template: string;
  className?: string;
};

function daysUntil(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86_400_000);
}

export function FestivalAnticipationCue({ startsAt, template, className }: FestivalAnticipationCueProps) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(startsAt);
    const tick = () => setDays(daysUntil(target));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [startsAt]);

  if (days === null || days <= 0) return null;

  const text = template.replace('{days}', String(days));

  return (
    <p className={className} aria-live="polite">
      {text}
    </p>
  );
}

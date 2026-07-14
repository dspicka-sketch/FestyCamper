'use client';

import { useEffect, useState } from 'react';
import type { FestivalCountdownTheme } from '@/lib/festivals/hero-dna';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
};

function getTimeLeft(target: Date): TimeLeft {
  const now = Date.now();
  const start = target.getTime();
  const diff = start - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, isPast: diff < -86_400_000 * 7 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isLive: false,
    isPast: false,
  };
}

type FestivalCountdownProps = {
  startsAt: string;
  festivalName: string;
  theme: FestivalCountdownTheme;
};

export function FestivalCountdown({ startsAt, festivalName, theme }: FestivalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(startsAt);
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startsAt]);

  const tileClass = `flex min-w-[4.25rem] flex-col items-center rounded-2xl border px-3 py-2.5 backdrop-blur-md sm:min-w-[4.75rem] sm:px-4 sm:py-3 ${theme.tileBorder} ${theme.tileBg}`;

  if (!timeLeft) {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-3" aria-hidden>
        {['Days', 'Hours', 'Mins', 'Secs'].map((label) => (
          <div key={label} className={tileClass}>
            <span className={`font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums opacity-40 sm:text-3xl ${theme.valueText}`}>
              --
            </span>
            <span className={`mt-0.5 text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${theme.labelText}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.isLive) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 backdrop-blur-md ${theme.liveBorder} ${theme.liveBg}`}>
        <span className={`h-2 w-2 animate-pulse rounded-full ${theme.liveDot}`} />
        <span className={`text-sm font-semibold ${theme.liveText}`}>
          {timeLeft.isPast ? `${festivalName} has wrapped — see you next year` : `${festivalName} is happening now`}
        </span>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {units.map(({ label, value }) => (
        <div key={label} className={tileClass}>
          <span className={`font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums sm:text-3xl ${theme.valueText}`}>
            {String(value).padStart(2, '0')}
          </span>
          <span className={`mt-0.5 text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${theme.labelText}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

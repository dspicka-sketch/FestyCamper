import type { SurfLocation } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";
import { computeSurfScore } from "@/lib/scoring/surf-score";

export interface FishingWindow {
  startHour: number;
  endHour: number;
  label: string;
  score: number;
}

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${period}`;
}

export function findBestTwoHourWindow(
  hourly: HourlyConditions[],
  location: SurfLocation,
): FishingWindow {
  let bestStart = 6;
  let bestScore = 0;

  for (let start = 5; start <= 18; start++) {
    const windowHours = hourly.filter(
      (h) => h.hour >= start && h.hour < start + 2,
    );
    if (windowHours.length < 2) continue;

    const avgScore =
      windowHours.reduce(
        (sum, h) => sum + computeSurfScore(h, location).score,
        0,
      ) / windowHours.length;

    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestStart = start;
    }
  }

  const endHour = bestStart + 2;
  return {
    startHour: bestStart,
    endHour,
    label: `${formatHourLabel(bestStart)} – ${formatHourLabel(endHour)}`,
    score: Math.round(bestScore),
  };
}

export interface LocationScore {
  location: SurfLocation;
  score: number;
  goNoGo: ReturnType<typeof computeSurfScore>["goNoGo"];
}

export function rankLocationsByScore(
  locations: SurfLocation[],
  hourly: HourlyConditions[],
  referenceHour = 7,
): LocationScore[] {
  const conditions =
    hourly.find((h) => h.hour === referenceHour) ?? hourly[0];

  return locations
    .map((location) => {
      const result = computeSurfScore(conditions, location);
      return {
        location,
        score: result.score,
        goNoGo: result.goNoGo,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function selectBestBeach(
  locations: SurfLocation[],
  hourly: HourlyConditions[],
  referenceHour = 7,
): LocationScore {
  const ranked = rankLocationsByScore(locations, hourly, referenceHour);
  return ranked[0];
}

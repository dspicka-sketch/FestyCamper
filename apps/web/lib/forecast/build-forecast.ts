import { generateForecastExplanation } from "@/lib/ai/explain";
import { SURF_LOCATIONS, type SurfLocation } from "@/lib/locations";
import { getMarineProvider } from "@/lib/marine/provider";
import type { DailyMarineData } from "@/lib/marine/types";
import { computeConfidence } from "@/lib/scoring/confidence";
import { recommendTackle } from "@/lib/scoring/tackle";
import {
  computeSurfScore,
  formatGoNoGo,
  type GoNoGoRating,
} from "@/lib/scoring/surf-score";
import {
  findBestTwoHourWindow,
  type FishingWindow,
} from "@/lib/scoring/window";
import { evaluateSafetyWarnings } from "@/lib/safety/warnings";
import { addDays, formatDateKey } from "@/lib/utils";

export interface DayForecastSummary {
  date: string;
  dayLabel: string;
  bestLocationName: string;
  bestLocationSlug: string;
  surfScore: number;
  goNoGo: GoNoGoRating;
  confidence: number;
}

export interface DailyForecast {
  date: string;
  generatedAt: string;
  dataSource: string;
  bestBeach: {
    name: string;
    slug: string;
    score: number;
    goNoGo: GoNoGoRating;
  };
  bestWindow: FishingWindow;
  primaryScore: number;
  goNoGo: GoNoGoRating;
  goNoGoLabel: string;
  confidence: {
    level: string;
    score: number;
    reason: string;
  };
  explanation: Awaited<ReturnType<typeof generateForecastExplanation>>;
  tackle: ReturnType<typeof recommendTackle>;
  safetyWarnings: ReturnType<typeof evaluateSafetyWarnings>;
  conditions: {
    tide: DailyMarineData["hourly"][0]["tide"];
    swell: DailyMarineData["hourly"][0]["swell"];
    wind: DailyMarineData["hourly"][0]["wind"];
    waterTempF: number;
  };
  allLocations: Array<{
    name: string;
    slug: string;
    score: number;
    goNoGo: GoNoGoRating;
  }>;
}

export interface WeeklyForecast {
  startDate: string;
  days: DayForecastSummary[];
}

async function rankAllLocations(date: Date) {
  const provider = getMarineProvider();
  const scores = await Promise.all(
    SURF_LOCATIONS.map(async (loc) => {
      const data = await provider.getDailyConditions(loc.id, date);
      const hour = data.hourly.find((h) => h.hour === 7) ?? data.hourly[0];
      const result = computeSurfScore(hour, loc);
      return {
        name: loc.name,
        slug: loc.slug,
        score: result.score,
        goNoGo: result.goNoGo,
      };
    }),
  );
  return scores.sort((a, b) => b.score - a.score);
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

async function buildLocationForecast(
  location: SurfLocation,
  date: Date,
): Promise<DailyForecast> {
  const provider = getMarineProvider();
  const marine = await provider.getDailyConditions(location.id, date);
  const morningHour = marine.hourly.find((h) => h.hour === 7) ?? marine.hourly[7];
  const scoreResult = computeSurfScore(morningHour, location);
  const confidence = computeConfidence(scoreResult.factors);
  const bestWindow = findBestTwoHourWindow(marine.hourly, location);
  const tackle = recommendTackle(location, morningHour);
  const warnings = evaluateSafetyWarnings(
    location,
    morningHour,
    scoreResult.goNoGo,
  );
  const explanation = await generateForecastExplanation(
    location,
    morningHour,
    scoreResult,
    tackle,
    warnings,
  );

  const bestBeachResult = (await rankAllLocations(date))[0];

  return {
    date: formatDateKey(date),
    generatedAt: new Date().toISOString(),
    dataSource: marine.dataSource,
    bestBeach: {
      name: bestBeachResult.name,
      slug: bestBeachResult.slug,
      score: bestBeachResult.score,
      goNoGo: bestBeachResult.goNoGo,
    },
    bestWindow,
    primaryScore: scoreResult.score,
    goNoGo: scoreResult.goNoGo,
    goNoGoLabel: formatGoNoGo(scoreResult.goNoGo),
    confidence: {
      level: confidence.level,
      score: confidence.score,
      reason: confidence.reason,
    },
    explanation,
    tackle,
    safetyWarnings: warnings,
    conditions: {
      tide: morningHour.tide,
      swell: morningHour.swell,
      wind: morningHour.wind,
      waterTempF: morningHour.waterTempF,
    },
    allLocations: await rankAllLocations(date),
  };
}

export async function getDailyForecast(
  date: Date = new Date(),
  locationSlug?: string,
): Promise<DailyForecast> {
  const location =
    (locationSlug
      ? SURF_LOCATIONS.find((l) => l.slug === locationSlug)
      : undefined) ?? SURF_LOCATIONS[0];

  return buildLocationForecast(location, date);
}

export async function getWeeklyForecast(
  startDate: Date = new Date(),
): Promise<WeeklyForecast> {
  const days: DayForecastSummary[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(startDate, i);
    const ranked = await rankAllLocations(date);
    const best = ranked[0];
    const bestLoc = SURF_LOCATIONS.find((l) => l.slug === best.slug)!;
    const provider = getMarineProvider();
    const marine = await provider.getDailyConditions(bestLoc.id, date);
    const hour = marine.hourly.find((h) => h.hour === 7) ?? marine.hourly[0];
    const scoreResult = computeSurfScore(hour, bestLoc);
    const confidence = computeConfidence(scoreResult.factors);

    days.push({
      date: formatDateKey(date),
      dayLabel: dayLabel(date),
      bestLocationName: best.name,
      bestLocationSlug: best.slug,
      surfScore: best.score,
      goNoGo: best.goNoGo,
      confidence: confidence.score,
    });
  }

  return {
    startDate: formatDateKey(startDate),
    days,
  };
}

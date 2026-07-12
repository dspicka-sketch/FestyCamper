import type { SurfLocation } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";
import { clamp } from "@/lib/utils";

export type GoNoGoRating = "go" | "maybe" | "no-go";

export interface FactorScores {
  tide: number;
  swell: number;
  wind: number;
  timeOfDay: number;
}

export interface SurfScoreResult {
  score: number;
  factors: FactorScores;
  goNoGo: GoNoGoRating;
}

const WEIGHTS = {
  tide: 0.25,
  swell: 0.3,
  wind: 0.3,
  timeOfDay: 0.15,
} as const;

/** Optimal incoming/outgoing mid-tide movement for surf perch fishing. */
export function scoreTide(conditions: HourlyConditions): number {
  const { phase, heightFt } = conditions.tide;

  let phaseScore = 0.5;
  if (phase === "incoming") phaseScore = 0.85;
  else if (phase === "outgoing") phaseScore = 0.75;
  else if (phase === "slack_low") phaseScore = 0.4;
  else phaseScore = 0.55;

  const heightScore =
    heightFt >= 1 && heightFt <= 4 ? 1 : heightFt < 0 ? 0.3 : 0.6;

  return clamp(phaseScore * 0.6 + heightScore * 0.4, 0, 1);
}

/** Moderate swell with decent period is best for Sonoma surf fishing. */
export function scoreSwell(
  conditions: HourlyConditions,
  location: SurfLocation,
): number {
  const { heightFt, periodSec } = conditions.swell;
  const exposure = location.swellExposure;

  const effectiveHeight = heightFt * exposure;

  let heightScore = 1;
  if (effectiveHeight < 1.5) heightScore = 0.5;
  else if (effectiveHeight <= 4) heightScore = 1;
  else if (effectiveHeight <= 6) heightScore = 0.55;
  else heightScore = 0.2;

  let periodScore = 0.5;
  if (periodSec >= 10 && periodSec <= 16) periodScore = 1;
  else if (periodSec >= 8) periodScore = 0.7;
  else periodScore = 0.4;

  return clamp(heightScore * 0.65 + periodScore * 0.35, 0, 1);
}

/** NW/W offshore wind is favorable; strong onshore is poor. */
export function scoreWind(
  conditions: HourlyConditions,
  location: SurfLocation,
): number {
  const { speedMph, directionDeg } = conditions.wind;
  const shelteredSpeed = speedMph * (1 - location.windShelter * 0.4);

  const isOffshore = directionDeg >= 250 && directionDeg <= 360;
  const isCrossShore = directionDeg >= 200 && directionDeg < 250;
  const isOnshore = directionDeg >= 60 && directionDeg < 200;

  let dirScore = 0.5;
  if (isOffshore) dirScore = 1;
  else if (isCrossShore) dirScore = 0.65;
  else if (isOnshore) dirScore = 0.25;

  let speedScore = 1;
  if (shelteredSpeed <= 10) speedScore = 1;
  else if (shelteredSpeed <= 15) speedScore = 0.7;
  else if (shelteredSpeed <= 20) speedScore = 0.45;
  else speedScore = 0.15;

  return clamp(dirScore * 0.5 + speedScore * 0.5, 0, 1);
}

/** Dawn and dusk windows favor surf perch activity. */
export function scoreTimeOfDay(hour: number): number {
  if (hour >= 5 && hour <= 8) return 1;
  if (hour >= 16 && hour <= 19) return 0.95;
  if (hour >= 9 && hour <= 11) return 0.75;
  if (hour >= 12 && hour <= 15) return 0.55;
  if (hour >= 20 && hour <= 21) return 0.6;
  return 0.35;
}

export function computeFactorScores(
  conditions: HourlyConditions,
  location: SurfLocation,
): FactorScores {
  return {
    tide: scoreTide(conditions),
    swell: scoreSwell(conditions, location),
    wind: scoreWind(conditions, location),
    timeOfDay: scoreTimeOfDay(conditions.hour),
  };
}

export function computeSurfScore(
  conditions: HourlyConditions,
  location: SurfLocation,
): SurfScoreResult {
  const factors = computeFactorScores(conditions, location);

  const raw =
    factors.tide * WEIGHTS.tide +
    factors.swell * WEIGHTS.swell +
    factors.wind * WEIGHTS.wind +
    factors.timeOfDay * WEIGHTS.timeOfDay;

  const score = Math.round(clamp(raw * 10, 1, 10));

  return {
    score,
    factors,
    goNoGo: scoreToGoNoGo(score),
  };
}

export function scoreToGoNoGo(score: number): GoNoGoRating {
  if (score >= 7) return "go";
  if (score >= 4) return "maybe";
  return "no-go";
}

export function formatGoNoGo(rating: GoNoGoRating): string {
  switch (rating) {
    case "go":
      return "Go";
    case "maybe":
      return "Maybe";
    case "no-go":
      return "No-Go";
  }
}

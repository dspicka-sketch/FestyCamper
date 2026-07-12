import { createAIAdapter } from "@/lib/ai/adapter";
import type { SurfLocation } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";
import type { TackleRecommendation } from "@/lib/scoring/tackle";
import type { SurfScoreResult } from "@/lib/scoring/surf-score";
import type { SafetyWarning } from "@/lib/safety/warnings";

export interface ForecastExplanation {
  summary: string;
  tideExplanation: string;
  swellExplanation: string;
  windExplanation: string;
  fishBehavior: string;
  aiGenerated: boolean;
}

function templateExplanation(
  location: SurfLocation,
  conditions: HourlyConditions,
  scoreResult: SurfScoreResult,
  tackle: TackleRecommendation,
): ForecastExplanation {
  const { tide, swell, wind } = conditions;

  const tideExplanation = `Tide is ${tide.phase.replace("_", " ")} at ${tide.heightFt} ft. ${
    tide.phase === "incoming"
      ? "Bait is pushed toward shore — perch often feed aggressively in the wash."
      : tide.phase === "outgoing"
        ? "Water draining off the beach concentrates fish in cuts and troughs."
        : "Slack tide slows movement — fish may hold near structure."
  }`;

  const swellExplanation = `Swell is ${swell.heightFt} ft at ${swell.periodSec}s from ${swell.directionDeg}°. ${
    swell.heightFt <= 3
      ? "Manageable surf — good for wading the wash zone."
      : swell.heightFt <= 5
        ? "Moderate surf — heavier weights and shorter casts recommended."
        : "Large surf — prioritize safety and sheltered spots."
  }`;

  const windExplanation = `Wind ${wind.speedMph} mph (gusts ${wind.gustMph}) from ${wind.directionDeg}°. ${
    wind.directionDeg >= 250
      ? "Offshore wind grooms the surf and improves visibility."
      : wind.directionDeg >= 60 && wind.directionDeg < 200
        ? "Onshore wind chops the surface and can shut down the bite."
        : "Cross-shore wind — workable but may affect casting distance."
  }`;

  const fishBehavior = `Target ${tackle.targetSpecies.join(" and ")} at ${location.name}. ${tackle.notes} SurfScore ${scoreResult.score}/10 suggests ${
    scoreResult.goNoGo === "go"
      ? "active feeding conditions."
      : scoreResult.goNoGo === "maybe"
        ? "variable activity — be patient and mobile."
        : "limited opportunity — consider another day."
  }`;

  const summary = `${location.name}: SurfScore ${scoreResult.score}/10 (${scoreResult.goNoGo.toUpperCase()}). Best window aligns with ${tide.phase} tide and ${
    swell.heightFt <= 4 ? "moderate" : "elevated"
  } swell.`;

  return {
    summary,
    tideExplanation,
    swellExplanation,
    windExplanation,
    fishBehavior,
    aiGenerated: false,
  };
}

export async function generateForecastExplanation(
  location: SurfLocation,
  conditions: HourlyConditions,
  scoreResult: SurfScoreResult,
  tackle: TackleRecommendation,
  warnings: SafetyWarning[],
): Promise<ForecastExplanation> {
  const fallback = templateExplanation(
    location,
    conditions,
    scoreResult,
    tackle,
  );

  const adapter = createAIAdapter();
  if (!adapter) return fallback;

  try {
    const response = await adapter.complete({
      messages: [
        {
          role: "system",
          content:
            "You are SurfScore, a Sonoma Coast surf fishing assistant. Explain the provided forecast data clearly. NEVER change, invent, or override the numeric scores or measurements — only explain them. Keep responses concise (3-4 short paragraphs total).",
        },
        {
          role: "user",
          content: JSON.stringify({
            location: location.name,
            surfScore: scoreResult.score,
            goNoGo: scoreResult.goNoGo,
            factors: scoreResult.factors,
            tide: conditions.tide,
            swell: conditions.swell,
            wind: conditions.wind,
            tackle,
            warnings: warnings.map((w) => w.title),
          }),
        },
      ],
      maxTokens: 500,
      temperature: 0.3,
    });

    if (!response.text.trim()) return fallback;

    return {
      ...fallback,
      summary: response.text.split("\n")[0] ?? fallback.summary,
      fishBehavior: response.text,
      aiGenerated: true,
    };
  } catch {
    return fallback;
  }
}

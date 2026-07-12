import type { FactorScores } from "@/lib/scoring/surf-score";
import { clamp } from "@/lib/utils";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ConfidenceResult {
  level: ConfidenceLevel;
  score: number;
  reason: string;
}

export function computeConfidence(factors: FactorScores): ConfidenceResult {
  const values = Object.values(factors);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const spread = Math.sqrt(variance);

  const agreementScore = clamp(1 - spread * 2, 0, 1);
  const strengthScore = clamp(mean, 0, 1);
  const combined = agreementScore * 0.6 + strengthScore * 0.4;
  const score = Math.round(combined * 100);

  let level: ConfidenceLevel;
  if (score >= 75) level = "high";
  else if (score >= 50) level = "medium";
  else level = "low";

  let reason: string;
  if (level === "high") {
    reason = "Conditions align across tide, swell, and wind — forecast is consistent.";
  } else if (level === "medium") {
    reason = "Mixed signals between factors — fishable but variable.";
  } else {
    reason = "Conflicting conditions reduce forecast certainty.";
  }

  return { level, score, reason };
}

export function formatConfidence(level: ConfidenceLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

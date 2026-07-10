import type { SurfLocation } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";
import type { GoNoGoRating } from "@/lib/scoring/surf-score";

export type SafetySeverity = "info" | "caution" | "danger";

export interface SafetyWarning {
  id: string;
  severity: SafetySeverity;
  title: string;
  message: string;
}

export function evaluateSafetyWarnings(
  location: SurfLocation,
  conditions: HourlyConditions,
  goNoGo: GoNoGoRating,
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];
  const { swell, wind, tide } = conditions;

  if (location.access === "gulch") {
    warnings.push({
      id: "gulch-access",
      severity: "caution",
      title: "Steep gulch trail",
      message:
        "Gulch access involves steep, slippery trails. Wear boots with grip and avoid during high swell.",
    });
  }

  if (location.access === "jetty" || location.access === "rocky") {
    warnings.push({
      id: "rocky-terrain",
      severity: "caution",
      title: "Slippery rocks",
      message:
        "Rocky and jetty terrain becomes extremely slippery with algae and spray. Never turn your back on the ocean.",
    });
  }

  const effectiveSwell = swell.heightFt * location.swellExposure;
  if (effectiveSwell >= 6) {
    warnings.push({
      id: "high-surf",
      severity: "danger",
      title: "High surf advisory",
      message: `Exposed swell around ${effectiveSwell.toFixed(1)} ft. Sneaker waves and strong rip currents likely.`,
    });
  } else if (effectiveSwell >= 4) {
    warnings.push({
      id: "elevated-surf",
      severity: "caution",
      title: "Elevated surf",
      message:
        "Moderate to large surf. Stay off wet rocks and keep distance from the waterline.",
    });
  }

  if (swell.periodSec >= 14 && effectiveSwell >= 3) {
    warnings.push({
      id: "long-period-swell",
      severity: "caution",
      title: "Long-period swell",
      message:
        "Long-period groundswell increases sneaker wave risk even when sets look spaced out.",
    });
  }

  const isOnshore = wind.directionDeg >= 60 && wind.directionDeg < 200;
  if (isOnshore && wind.speedMph >= 18) {
    warnings.push({
      id: "strong-onshore-wind",
      severity: "caution",
      title: "Strong onshore wind",
      message:
        "Onshore winds create choppy surf and reduce visibility. Casting and wading become hazardous.",
    });
  }

  if (wind.gustMph >= 25) {
    warnings.push({
      id: "wind-gusts",
      severity: "caution",
      title: "Strong wind gusts",
      message: `Gusts to ${wind.gustMph} mph. Secure gear and avoid exposed points.`,
    });
  }

  if (tide.heightFt < 0 && (location.access === "rocky" || location.access === "jetty")) {
    warnings.push({
      id: "negative-low-tide",
      severity: "caution",
      title: "Negative low tide",
      message:
        "Extreme low tide exposes slick rocks and increases wave impact at previously dry areas.",
    });
  }

  if (goNoGo === "no-go") {
    warnings.push({
      id: "no-go-conditions",
      severity: "danger",
      title: "Poor fishing conditions",
      message:
        "SurfScore rates today as No-Go. Consider rescheduling or choosing a sheltered location.",
    });
  }

  return warnings;
}

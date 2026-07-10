import { describe, expect, it } from "vitest";
import { SURF_LOCATIONS } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";
import { evaluateSafetyWarnings } from "@/lib/safety/warnings";

function makeConditions(overrides: Partial<HourlyConditions> = {}): HourlyConditions {
  return {
    hour: 10,
    tide: { time: "", heightFt: 2, phase: "incoming" },
    swell: { heightFt: 3, periodSec: 11, directionDeg: 280 },
    wind: { speedMph: 10, directionDeg: 300, gustMph: 14 },
    waterTempF: 54,
    cloudCoverPct: 20,
    ...overrides,
  };
}

describe("safety warnings", () => {
  it("warns on gulch access locations", () => {
    const gulch = SURF_LOCATIONS.find((l) => l.slug === "shorttail-gulch")!;
    const warnings = evaluateSafetyWarnings(
      gulch,
      makeConditions(),
      "go",
    );
    expect(warnings.some((w) => w.id === "gulch-access")).toBe(true);
  });

  it("warns on high surf at exposed beaches", () => {
    const dillon = SURF_LOCATIONS.find((l) => l.slug === "dillon-beach")!;
    const warnings = evaluateSafetyWarnings(
      dillon,
      makeConditions({ swell: { heightFt: 8, periodSec: 14, directionDeg: 280 } }),
      "no-go",
    );
    expect(warnings.some((w) => w.id === "high-surf")).toBe(true);
  });

  it("warns on long-period swell", () => {
    const wrights = SURF_LOCATIONS.find((l) => l.slug === "wrights-beach")!;
    const warnings = evaluateSafetyWarnings(
      wrights,
      makeConditions({ swell: { heightFt: 4, periodSec: 16, directionDeg: 280 } }),
      "maybe",
    );
    expect(warnings.some((w) => w.id === "long-period-swell")).toBe(true);
  });

  it("warns on strong onshore wind", () => {
    const warnings = evaluateSafetyWarnings(
      SURF_LOCATIONS[0],
      makeConditions({
        wind: { speedMph: 20, directionDeg: 120, gustMph: 28 },
      }),
      "maybe",
    );
    expect(warnings.some((w) => w.id === "strong-onshore-wind")).toBe(true);
  });

  it("adds no-go advisory when rating is no-go", () => {
    const warnings = evaluateSafetyWarnings(
      SURF_LOCATIONS[0],
      makeConditions(),
      "no-go",
    );
    expect(warnings.some((w) => w.id === "no-go-conditions")).toBe(true);
  });

  it("warns on negative low tide at rocky spots", () => {
    const jetty = SURF_LOCATIONS.find((l) => l.slug === "doran-jetty")!;
    const warnings = evaluateSafetyWarnings(
      jetty,
      makeConditions({ tide: { time: "", heightFt: -0.8, phase: "slack_low" } }),
      "maybe",
    );
    expect(warnings.some((w) => w.id === "negative-low-tide")).toBe(true);
  });
});

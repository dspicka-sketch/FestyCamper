import { describe, expect, it } from "vitest";
import { SURF_LOCATIONS } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";
import {
  computeSurfScore,
  scoreSwell,
  scoreTide,
  scoreTimeOfDay,
  scoreToGoNoGo,
  scoreWind,
} from "@/lib/scoring/surf-score";
import { findBestTwoHourWindow } from "@/lib/scoring/window";
import { computeConfidence } from "@/lib/scoring/confidence";

const doranBeach = SURF_LOCATIONS.find((l) => l.slug === "doran-beach")!;

function makeConditions(overrides: Partial<HourlyConditions> = {}): HourlyConditions {
  return {
    hour: 7,
    tide: {
      time: "2026-07-10T07:00:00.000Z",
      heightFt: 2.5,
      phase: "incoming",
    },
    swell: {
      heightFt: 3,
      periodSec: 12,
      directionDeg: 285,
    },
    wind: {
      speedMph: 8,
      directionDeg: 320,
      gustMph: 12,
    },
    waterTempF: 54,
    cloudCoverPct: 30,
    ...overrides,
  };
}

describe("surf score", () => {
  it("returns score between 1 and 10", () => {
    const result = computeSurfScore(makeConditions(), doranBeach);
    expect(result.score).toBeGreaterThanOrEqual(1);
    expect(result.score).toBeGreaterThanOrEqual(1);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it("rates ideal dawn incoming tide highly", () => {
    const ideal = computeSurfScore(makeConditions(), doranBeach);
    const poor = computeSurfScore(
      makeConditions({
        hour: 14,
        tide: { time: "", heightFt: -0.5, phase: "slack_low" },
        swell: { heightFt: 8, periodSec: 6, directionDeg: 120 },
        wind: { speedMph: 22, directionDeg: 150, gustMph: 30 },
      }),
      doranBeach,
    );
    expect(ideal.score).toBeGreaterThan(poor.score);
  });

  it("maps score to go/maybe/no-go thresholds", () => {
    expect(scoreToGoNoGo(8)).toBe("go");
    expect(scoreToGoNoGo(7)).toBe("go");
    expect(scoreToGoNoGo(5)).toBe("maybe");
    expect(scoreToGoNoGo(4)).toBe("maybe");
    expect(scoreToGoNoGo(3)).toBe("no-go");
  });

  it("prefers incoming tide over slack low", () => {
    const incomingScore = scoreTide(
      makeConditions({ tide: { time: "", heightFt: 2, phase: "incoming" } }),
    );
    const slackLowScore = scoreTide(
      makeConditions({ tide: { time: "", heightFt: 0, phase: "slack_low" } }),
    );
    expect(incomingScore).toBeGreaterThan(slackLowScore);
  });

  it("penalizes large swell at exposed beaches", () => {
    const moderate = scoreSwell(
      makeConditions({ swell: { heightFt: 3, periodSec: 12, directionDeg: 280 } }),
      doranBeach,
    );
    const large = scoreSwell(
      makeConditions({ swell: { heightFt: 9, periodSec: 12, directionDeg: 280 } }),
      SURF_LOCATIONS.find((l) => l.slug === "dillon-beach")!,
    );
    expect(moderate).toBeGreaterThan(large);
  });

  it("rewards offshore wind", () => {
    const offshore = scoreWind(
      makeConditions({ wind: { speedMph: 8, directionDeg: 310, gustMph: 12 } }),
      doranBeach,
    );
    const onshore = scoreWind(
      makeConditions({ wind: { speedMph: 8, directionDeg: 120, gustMph: 12 } }),
      doranBeach,
    );
    expect(offshore).toBeGreaterThan(onshore);
  });

  it("favors dawn and dusk hours", () => {
    expect(scoreTimeOfDay(6)).toBeGreaterThan(scoreTimeOfDay(14));
    expect(scoreTimeOfDay(17)).toBeGreaterThan(scoreTimeOfDay(22));
  });

  it("finds a two-hour window between 5am and 8pm", () => {
    const hourly = Array.from({ length: 24 }, (_, hour) =>
      makeConditions({ hour }),
    );
    const window = findBestTwoHourWindow(hourly, doranBeach);
    expect(window.startHour).toBeGreaterThanOrEqual(5);
    expect(window.endHour).toBeLessThanOrEqual(20);
    expect(window.endHour - window.startHour).toBe(2);
  });

  it("computes confidence from factor agreement", () => {
    const aligned = computeConfidence({
      tide: 0.9,
      swell: 0.85,
      wind: 0.88,
      timeOfDay: 0.92,
    });
    const mixed = computeConfidence({
      tide: 0.9,
      swell: 0.3,
      wind: 0.85,
      timeOfDay: 0.2,
    });
    expect(aligned.score).toBeGreaterThan(mixed.score);
  });
});

describe("locations", () => {
  it("includes eight beta beaches and excludes salmon creek", () => {
    expect(SURF_LOCATIONS).toHaveLength(8);
    const names = SURF_LOCATIONS.map((l) => l.name.toLowerCase());
    expect(names.some((n) => n.includes("salmon"))).toBe(false);
  });
});

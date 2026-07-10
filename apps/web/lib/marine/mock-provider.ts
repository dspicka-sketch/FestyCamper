import { getLocationById } from "@/lib/locations";
import type {
  DailyMarineData,
  HourlyConditions,
  MarineDataProvider,
  TidePhase,
  TideReading,
} from "@/lib/marine/types";
import {
  addDays,
  clamp,
  formatDateKey,
  lerp,
  seededRandom,
} from "@/lib/utils";

const BASE_SWELL_HEIGHT = 3.5;
const BASE_WIND_SPEED = 8;

function tidePhaseFromDerivative(delta: number): TidePhase {
  if (Math.abs(delta) < 0.05) return delta >= 0 ? "slack_high" : "slack_low";
  return delta > 0 ? "incoming" : "outgoing";
}

function generateTideEvents(date: Date, rand: () => number): TideReading[] {
  const dayOffset = date.getUTCDate();
  const lowHour1 = 2 + (dayOffset % 3);
  const highHour1 = lowHour1 + 6;
  const lowHour2 = highHour1 + 6;
  const highHour2 = lowHour2 + 6;

  const events: Array<{ hour: number; height: number; phase: TidePhase }> = [
    { hour: lowHour1 % 24, height: -0.8 + rand() * 0.4, phase: "slack_low" },
    { hour: highHour1 % 24, height: 4.5 + rand() * 1.2, phase: "slack_high" },
    { hour: lowHour2 % 24, height: -0.5 + rand() * 0.3, phase: "slack_low" },
    { hour: highHour2 % 24, height: 4.0 + rand() * 1.0, phase: "slack_high" },
  ];

  return events
    .sort((a, b) => a.hour - b.hour)
    .map((e) => ({
      time: `${formatDateKey(date)}T${String(e.hour).padStart(2, "0")}:00:00.000Z`,
      heightFt: Math.round(e.height * 10) / 10,
      phase: e.phase,
    }));
}

function tideHeightAtHour(
  hour: number,
  events: Array<{ hour: number; height: number }>,
): number {
  const sorted = [...events].sort((a, b) => a.hour - b.hour);
  let prev = sorted[sorted.length - 1];
  let next = sorted[0];

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].hour <= hour) prev = sorted[i];
    if (sorted[i].hour > hour && next.hour <= prev.hour) {
      next = sorted[i];
      break;
    }
    if (sorted[i].hour > hour) {
      next = sorted[i];
      break;
    }
  }

  const prevHour = prev.hour;
  let nextHour = next.hour;
  if (nextHour <= prevHour) nextHour += 24;

  const adjustedHour = hour < prevHour ? hour + 24 : hour;
  const t =
    prevHour === nextHour
      ? 0
      : (adjustedHour - prevHour) / (nextHour - prevHour);

  const height = lerp(prev.height, next.height, clamp(t, 0, 1));
  return Math.round(height * 10) / 10;
}

function buildHourlyConditions(
  date: Date,
  locationId: string,
  rand: () => number,
): HourlyConditions[] {
  const location = getLocationById(locationId);
  const exposure = location?.swellExposure ?? 0.7;
  const shelter = location?.windShelter ?? 0.5;

  const tideEventsRaw = generateTideEvents(date, rand).map((e) => ({
    hour: parseInt(e.time.slice(11, 13), 10),
    height: e.heightFt,
  }));

  const hourly: HourlyConditions[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourRand = seededRandom(`${locationId}-${formatDateKey(date)}-${hour}`);
    const tideHeight = tideHeightAtHour(hour, tideEventsRaw);
    const prevHeight = tideHeightAtHour((hour + 23) % 24, tideEventsRaw);
    const phase = tidePhaseFromDerivative(tideHeight - prevHeight);

    const swellBase =
      BASE_SWELL_HEIGHT * exposure + (hourRand() - 0.5) * 1.5;
    const periodBase = 10 + hourRand() * 6;
    const windBase =
      BASE_WIND_SPEED * (1 - shelter * 0.5) + hourRand() * 6;

    hourly.push({
      hour,
      tide: {
        time: `${formatDateKey(date)}T${String(hour).padStart(2, "0")}:00:00.000Z`,
        heightFt: tideHeight,
        phase,
      },
      swell: {
        heightFt: Math.round(clamp(swellBase, 1, 10) * 10) / 10,
        periodSec: Math.round(periodBase * 10) / 10,
        directionDeg: 280 + Math.round(hourRand() * 30),
      },
      wind: {
        speedMph: Math.round(clamp(windBase, 2, 28)),
        directionDeg: 310 + Math.round(hourRand() * 40),
        gustMph: Math.round(clamp(windBase * 1.3, 3, 35)),
      },
      waterTempF: Math.round(52 + hourRand() * 4),
      cloudCoverPct: Math.round(hourRand() * 80),
    });
  }

  return hourly;
}

export class MockMarineDataProvider implements MarineDataProvider {
  readonly name = "mock-sonoma-coast";

  async getDailyConditions(
    locationId: string,
    date: Date,
  ): Promise<DailyMarineData> {
    const rand = seededRandom(`${locationId}-${formatDateKey(date)}`);
    const hourly = buildHourlyConditions(date, locationId, rand);
    return {
      locationId,
      date: formatDateKey(date),
      hourly,
      tideEvents: generateTideEvents(date, rand),
      dataSource: this.name,
    };
  }

  async getWeeklyConditions(
    locationId: string,
    startDate: Date,
  ): Promise<DailyMarineData[]> {
    const days: DailyMarineData[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(await this.getDailyConditions(locationId, addDays(startDate, i)));
    }
    return days;
  }
}

export const mockMarineProvider = new MockMarineDataProvider();

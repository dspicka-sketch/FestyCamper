export type TidePhase = "incoming" | "outgoing" | "slack_high" | "slack_low";

export interface TideReading {
  time: string;
  heightFt: number;
  phase: TidePhase;
}

export interface SwellReading {
  heightFt: number;
  periodSec: number;
  directionDeg: number;
}

export interface WindReading {
  speedMph: number;
  directionDeg: number;
  gustMph: number;
}

export interface HourlyConditions {
  hour: number;
  tide: TideReading;
  swell: SwellReading;
  wind: WindReading;
  waterTempF: number;
  cloudCoverPct: number;
}

export interface DailyMarineData {
  locationId: string;
  date: string;
  hourly: HourlyConditions[];
  tideEvents: TideReading[];
  dataSource: string;
}

export interface MarineDataProvider {
  readonly name: string;
  getDailyConditions(locationId: string, date: Date): Promise<DailyMarineData>;
  getWeeklyConditions(locationId: string, startDate: Date): Promise<DailyMarineData[]>;
}

export interface MarineProviderConfig {
  provider: "mock" | "noaa";
}

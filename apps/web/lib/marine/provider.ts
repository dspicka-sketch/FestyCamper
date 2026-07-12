import { mockMarineProvider } from "@/lib/marine/mock-provider";
import type { MarineDataProvider, MarineProviderConfig } from "@/lib/marine/types";

export function createMarineProvider(
  config: MarineProviderConfig = { provider: "mock" },
): MarineDataProvider {
  switch (config.provider) {
    case "mock":
      return mockMarineProvider;
    case "noaa":
      // Placeholder for future NOAA CO-OPS / NDBC integration.
      // Swap provider via MARINE_DATA_PROVIDER=noaa when implemented.
      throw new Error(
        "NOAA provider not yet implemented. Set MARINE_DATA_PROVIDER=mock.",
      );
    default:
      return mockMarineProvider;
  }
}

export function getMarineProvider(): MarineDataProvider {
  const provider = (process.env.MARINE_DATA_PROVIDER ?? "mock") as
    | "mock"
    | "noaa";
  return createMarineProvider({ provider });
}

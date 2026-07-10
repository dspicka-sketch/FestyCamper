import type { SurfLocation } from "@/lib/locations";
import type { HourlyConditions } from "@/lib/marine/types";

export interface TackleRecommendation {
  bait: string[];
  lures: string[];
  rig: string;
  targetSpecies: string[];
  notes: string;
}

export function recommendTackle(
  location: SurfLocation,
  conditions: HourlyConditions,
): TackleRecommendation {
  const { swell, tide, wind } = conditions;
  const isRough = swell.heightFt * location.swellExposure >= 4;
  const isCalm = wind.speedMph <= 10 && swell.heightFt <= 3;

  const bait: string[] = ["Fresh sand crabs (mole crabs)", "Frozen anchovy strips"];
  const lures: string[] = [];
  let rig = "Carolina rig with 1–2 oz pyramid sinker, 18\" leader, size 2–4 hook";
  const targetSpecies = ["Surf perch", "Striped bass (seasonal)"];
  let notes = "Fish the wash zone on incoming tide for perch schools.";

  if (location.access === "jetty" || location.access === "rocky") {
    bait.push("Live ghost shrimp", "Mussel meat");
    lures.push("3\" Berkley Gulp! Camo Worm (natural)", "1/4 oz jig head with grub");
    rig = "High-low rig with 2–4 oz weight, size 4 and 2 hooks";
    targetSpecies.push("Rockfish (near structure)", "Cabezon");
    notes = "Work structure edges during slack and early outgoing tide.";
  }

  if (location.access === "gulch") {
    bait.push("Sand worms", "Squid strips");
    lures.push("4\" swimbait on 3/8 oz jig");
    notes =
      "Access early before swell builds. Target perch in sandy pockets between rocks.";
  }

  if (location.access === "sandy") {
    lures.push("1/2 oz Kastmaster spoon", "3\" curl-tail grub on 1/4 oz jig");
    if (isCalm) {
      bait.push("Live sand crabs at dawn");
      notes = "Calm conditions favor sight-fishing the trough with sand crabs.";
    }
  }

  if (isRough) {
    rig = "Heavy Carolina rig with 3–4 oz sinker, 24\" fluorocarbon leader";
    notes =
      "Rough surf — use heavier weight to hold bottom and shorten casts for safety.";
  }

  if (tide.phase === "incoming") {
    notes += " Incoming tide is pushing bait into the surf zone.";
  } else if (tide.phase === "outgoing") {
    notes += " Outgoing tide may concentrate perch in cuts and channels.";
  }

  return {
    bait,
    lures,
    rig,
    targetSpecies,
    notes,
  };
}

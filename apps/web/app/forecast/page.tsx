import {
  ConfidenceMeter,
  ScoreBadge,
  WarningList,
  WeeklyForecastTable,
} from "@/components/forecast/ForecastCards";
import { getDailyForecast, getWeeklyForecast } from "@/lib/forecast/build-forecast";
import { SURF_LOCATIONS } from "@/lib/locations";

export default async function ForecastPage() {
  const today = new Date();
  const [daily, weekly] = await Promise.all([
    getDailyForecast(today),
    getWeeklyForecast(today),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-ocean-400">
          Sonoma Coast — {daily.date}
        </p>
        <h1 className="font-display mt-2 text-4xl text-sand-50">
          Daily Fishing Forecast
        </h1>
        <p className="mt-2 text-sand-300">
          Data source: {daily.dataSource} · Generated{" "}
          {new Date(daily.generatedAt).toLocaleTimeString("en-US", {
            timeZone: "America/Los_Angeles",
          })}{" "}
          PT
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6 lg:col-span-1">
          <h2 className="text-center text-sm uppercase tracking-widest text-ocean-400">
            Surf Score
          </h2>
          <div className="mt-4 flex justify-center">
            <ScoreBadge
              score={daily.primaryScore}
              goNoGo={daily.goNoGo}
              label={daily.goNoGoLabel}
            />
          </div>
          <div className="mt-6">
            <ConfidenceMeter
              score={daily.confidence.score}
              level={daily.confidence.level}
            />
            <p className="mt-2 text-xs text-ocean-300">{daily.confidence.reason}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6 lg:col-span-2">
          <h2 className="font-display text-2xl text-sand-100">Today&apos;s picks</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-ocean-950/60 p-4">
              <p className="text-sm text-ocean-400">Best beach</p>
              <p className="mt-1 text-xl font-semibold text-sand-50">
                {daily.bestBeach.name}
              </p>
              <p className="text-sm text-sand-300">
                Score {daily.bestBeach.score}/10 ·{" "}
                {daily.bestBeach.goNoGo.replace("-", " ")}
              </p>
            </div>
            <div className="rounded-xl bg-ocean-950/60 p-4">
              <p className="text-sm text-ocean-400">Best 2-hour window</p>
              <p className="mt-1 text-xl font-semibold text-sand-50">
                {daily.bestWindow.label}
              </p>
              <p className="text-sm text-sand-300">
                Window score {daily.bestWindow.score}/10
              </p>
            </div>
          </div>
          <p className="mt-4 text-sand-200">{daily.explanation.summary}</p>
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6">
          <h2 className="font-display text-xl text-sand-100">Conditions</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-ocean-800 pb-2">
              <dt className="text-ocean-400">Tide</dt>
              <dd className="text-sand-100">
                {daily.conditions.tide.phase.replace("_", " ")} ·{" "}
                {daily.conditions.tide.heightFt} ft
              </dd>
            </div>
            <div className="flex justify-between border-b border-ocean-800 pb-2">
              <dt className="text-ocean-400">Swell</dt>
              <dd className="text-sand-100">
                {daily.conditions.swell.heightFt} ft @{" "}
                {daily.conditions.swell.periodSec}s ·{" "}
                {daily.conditions.swell.directionDeg}°
              </dd>
            </div>
            <div className="flex justify-between border-b border-ocean-800 pb-2">
              <dt className="text-ocean-400">Wind</dt>
              <dd className="text-sand-100">
                {daily.conditions.wind.speedMph} mph (gusts{" "}
                {daily.conditions.wind.gustMph}) ·{" "}
                {daily.conditions.wind.directionDeg}°
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ocean-400">Water temp</dt>
              <dd className="text-sand-100">{daily.conditions.waterTempF}°F</dd>
            </div>
          </dl>
          <div className="mt-6 space-y-3 text-sm text-sand-300">
            <p>{daily.explanation.tideExplanation}</p>
            <p>{daily.explanation.swellExplanation}</p>
            <p>{daily.explanation.windExplanation}</p>
            <p className="text-sand-200">{daily.explanation.fishBehavior}</p>
            {daily.explanation.aiGenerated && (
              <p className="text-xs text-ocean-500">AI-enhanced explanation</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6">
          <h2 className="font-display text-xl text-sand-100">Tackle & rig</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium text-ocean-400">Bait</p>
              <ul className="mt-1 list-inside list-disc text-sand-200">
                {daily.tackle.bait.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-ocean-400">Lures</p>
              <ul className="mt-1 list-inside list-disc text-sand-200">
                {daily.tackle.lures.length > 0 ? (
                  daily.tackle.lures.map((l) => <li key={l}>{l}</li>)
                ) : (
                  <li>Natural bait preferred today</li>
                )}
              </ul>
            </div>
            <div>
              <p className="font-medium text-ocean-400">Rig</p>
              <p className="mt-1 text-sand-200">{daily.tackle.rig}</p>
            </div>
            <div>
              <p className="font-medium text-ocean-400">Target species</p>
              <p className="mt-1 text-sand-200">
                {daily.tackle.targetSpecies.join(", ")}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6">
        <h2 className="font-display text-xl text-sand-100">Safety warnings</h2>
        <div className="mt-4">
          <WarningList warnings={daily.safetyWarnings} />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6">
        <h2 className="font-display text-xl text-sand-100">All beaches today</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {daily.allLocations.map((loc) => (
            <div
              key={loc.slug}
              className="rounded-lg border border-ocean-800 bg-ocean-950/50 px-3 py-2"
            >
              <p className="font-medium text-sand-100">{loc.name}</p>
              <p className="text-sm text-sand-300">
                {loc.score}/10 · {loc.goNoGo.replace("-", " ")}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ocean-500">
          {SURF_LOCATIONS.length} beta locations · Salmon Creek excluded
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-ocean-800 bg-ocean-900/40 p-6">
        <h2 className="font-display text-xl text-sand-100">7-day outlook</h2>
        <div className="mt-4">
          <WeeklyForecastTable days={weekly.days} />
        </div>
      </section>
    </div>
  );
}

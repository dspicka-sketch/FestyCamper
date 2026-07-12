import type { GoNoGoRating } from "@/lib/scoring/surf-score";

function goNoGoClass(rating: GoNoGoRating): string {
  switch (rating) {
    case "go":
      return "score-ring-go";
    case "maybe":
      return "score-ring-maybe";
    case "no-go":
      return "score-ring-nogo";
  }
}

function goNoGoBg(rating: GoNoGoRating): string {
  switch (rating) {
    case "go":
      return "bg-go/20 text-go";
    case "maybe":
      return "bg-maybe/20 text-maybe";
    case "no-go":
      return "bg-nogo/20 text-nogo";
  }
}

export function ScoreBadge({
  score,
  goNoGo,
  label,
}: {
  score: number;
  goNoGo: GoNoGoRating;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full border-4 text-4xl font-bold ${goNoGoClass(goNoGo)}`}
      >
        {score}
      </div>
      <span
        className={`rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide ${goNoGoBg(goNoGo)}`}
      >
        {label}
      </span>
    </div>
  );
}

export function ConfidenceMeter({ score, level }: { score: number; level: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-sand-300">Confidence</span>
        <span className="font-medium text-sand-100 capitalize">{level}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ocean-800">
        <div
          className="h-full rounded-full bg-ocean-400 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-ocean-300">{score}%</p>
    </div>
  );
}

export function WarningList({
  warnings,
}: {
  warnings: Array<{ id: string; severity: string; title: string; message: string }>;
}) {
  if (warnings.length === 0) {
    return (
      <p className="text-sm text-ocean-300">No active safety warnings.</p>
    );
  }

  const severityColor = (s: string) => {
    if (s === "danger") return "border-nogo/50 bg-nogo/10";
    if (s === "caution") return "border-maybe/50 bg-maybe/10";
    return "border-ocean-600 bg-ocean-900/50";
  };

  return (
    <ul className="space-y-3">
      {warnings.map((w) => (
        <li
          key={w.id}
          className={`rounded-lg border p-4 ${severityColor(w.severity)}`}
        >
          <p className="font-semibold text-sand-100">{w.title}</p>
          <p className="mt-1 text-sm text-sand-300">{w.message}</p>
        </li>
      ))}
    </ul>
  );
}

export function WeeklyForecastTable({
  days,
}: {
  days: Array<{
    date: string;
    dayLabel: string;
    bestLocationName: string;
    surfScore: number;
    goNoGo: GoNoGoRating;
    confidence: number;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ocean-700 text-ocean-300">
            <th className="py-2 pr-4">Day</th>
            <th className="py-2 pr-4">Best Beach</th>
            <th className="py-2 pr-4">Score</th>
            <th className="py-2 pr-4">Rating</th>
            <th className="py-2">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.date} className="border-b border-ocean-800/80">
              <td className="py-3 pr-4 font-medium text-sand-100">{d.dayLabel}</td>
              <td className="py-3 pr-4 text-sand-200">{d.bestLocationName}</td>
              <td className="py-3 pr-4 font-bold text-sand-100">{d.surfScore}</td>
              <td className="py-3 pr-4 capitalize">{d.goNoGo.replace("-", " ")}</td>
              <td className="py-3 text-ocean-300">{d.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { goNoGoBg, goNoGoClass };

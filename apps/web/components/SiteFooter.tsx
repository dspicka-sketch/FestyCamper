export function SiteFooter() {
  return (
    <footer className="border-t border-ocean-800/80 bg-ocean-950 py-8 text-sm text-ocean-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p>SurfScore — Sonoma Coast closed beta</p>
        <p className="text-ocean-400">
          Scores are deterministic. AI explains — never overrides measurements.
        </p>
      </div>
    </footer>
  );
}

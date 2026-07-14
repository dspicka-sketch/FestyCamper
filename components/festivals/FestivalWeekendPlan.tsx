type FestivalWeekendPlanProps = {
  name: string;
  description: string;
  campNotes: string;
};

export function FestivalWeekendPlan({ name, description, campNotes }: FestivalWeekendPlanProps) {
  return (
    <section id="plan-your-weekend" className="relative scroll-mt-24 border-b border-white/10 py-14 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/30 to-forest-950" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Your weekend</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50 sm:text-3xl">
          Plan your {name} experience
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-sand-200/75 sm:text-lg">
          {description}
        </p>
        <div className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-forest-900/50 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-200/50">
            Curated camp notes
          </p>
          <p className="mt-3 text-sm leading-relaxed text-sand-200/80 sm:text-base">{campNotes}</p>
        </div>
      </div>
    </section>
  );
}

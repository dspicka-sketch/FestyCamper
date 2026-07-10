'use client';

type BookingActionsProps = {
  email: string;
  renterName: string;
};

export function BookingActions({ email, renterName }: BookingActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => alert('Approve flow coming soon.')}
        className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition-all duration-200 hover:bg-emerald-500/25 hover:ring-emerald-400/50"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={() => alert('Decline flow coming soon.')}
        className="rounded-full bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30 transition-all duration-200 hover:bg-rose-500/25 hover:ring-rose-400/50"
      >
        Decline
      </button>
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(`FestyCamper booking — ${renterName}`)}`}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/10"
      >
        Contact
      </a>
    </div>
  );
}

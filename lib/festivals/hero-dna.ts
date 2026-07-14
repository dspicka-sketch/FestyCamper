export type FestivalCountdownTheme = {
  tileBorder: string;
  tileBg: string;
  valueText: string;
  labelText: string;
  liveBorder: string;
  liveBg: string;
  liveText: string;
  liveDot: string;
};

export type FestivalHeroDna = {
  tagline: string;
  /** Optional understated anticipation line; `{days}` is replaced live. */
  emotionalCue?: string;
  heroImage: string;
  imagePosition: string;
  colorWash: string;
  accentGradient: string;
  scrimGradient: string;
  accentLabel: string;
  accentIcon: string;
  ctaFrom: string;
  ctaTo: string;
  ctaShadow: string;
  monogramBorder: string;
  monogramBg: string;
  countdown: FestivalCountdownTheme;
};

export const FESTIVAL_HERO_DNA: Record<string, FestivalHeroDna> = {
  coachella: {
    tagline:
      'Stake your shade before noon, wander the art at golden hour, and leave one night with no plan—that\'s usually the best one.',
    emotionalCue: '{days} days until the desert comes alive.',
    heroImage:
      'https://images.unsplash.com/photo-1632858432305-657402712ca5?auto=format&fit=crop&w=2400&q=80',
    imagePosition: 'object-[center_40%]',
    colorWash: 'from-amber-300/30 via-orange-400/28 to-rose-400/22',
    accentGradient: 'from-amber-900/35 via-orange-950/45 to-violet-900/35',
    scrimGradient: 'from-forest-950/88 via-amber-950/35 to-transparent',
    accentLabel: 'text-amber-100/85',
    accentIcon: 'text-amber-200/90',
    ctaFrom: 'from-amber-200',
    ctaTo: 'to-orange-300',
    ctaShadow: 'shadow-amber-300/35 hover:shadow-amber-300/50',
    monogramBorder: 'border-amber-200/30',
    monogramBg: 'bg-amber-950/35',
    countdown: {
      tileBorder: 'border-amber-200/25',
      tileBg: 'bg-amber-950/40',
      valueText: 'text-amber-50',
      labelText: 'text-amber-100/55',
      liveBorder: 'border-amber-300/35',
      liveBg: 'bg-amber-400/10',
      liveText: 'text-amber-50',
      liveDot: 'bg-amber-300',
    },
  },
  'burning-man': {
    tagline: 'Seven days of white playa dust, fire-lit nights, and strangers who feel like home.',
    heroImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=80',
    imagePosition: 'object-center',
    colorWash: 'from-stone-300/25 via-amber-200/20 to-orange-600/30',
    accentGradient: 'from-stone-900/50 via-orange-950/55 to-forest-950/95',
    scrimGradient: 'from-forest-950/92 via-stone-950/50 to-transparent',
    accentLabel: 'text-amber-200/85',
    accentIcon: 'text-amber-300/80',
    ctaFrom: 'from-amber-300',
    ctaTo: 'to-orange-400',
    ctaShadow: 'shadow-amber-400/25 hover:shadow-amber-400/40',
    monogramBorder: 'border-amber-200/20',
    monogramBg: 'bg-stone-900/50',
    countdown: {
      tileBorder: 'border-stone-300/15',
      tileBg: 'bg-stone-900/55',
      valueText: 'text-amber-50',
      labelText: 'text-stone-300/55',
      liveBorder: 'border-amber-400/30',
      liveBg: 'bg-amber-500/10',
      liveText: 'text-amber-100',
      liveDot: 'bg-amber-400',
    },
  },
  'outside-lands': {
    tagline: 'Fog rolling through the trees, gourmet pauses, and sets discovered on foot.',
    heroImage:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80',
    imagePosition: 'object-center',
    colorWash: 'from-emerald-600/30 via-teal-700/25 to-slate-500/35',
    accentGradient: 'from-emerald-950/45 via-slate-900/55 to-forest-950/90',
    scrimGradient: 'from-forest-950/88 via-emerald-950/40 to-transparent',
    accentLabel: 'text-emerald-200/85',
    accentIcon: 'text-teal-300/80',
    ctaFrom: 'from-emerald-300',
    ctaTo: 'to-teal-400',
    ctaShadow: 'shadow-emerald-400/25 hover:shadow-emerald-400/40',
    monogramBorder: 'border-emerald-200/20',
    monogramBg: 'bg-emerald-950/40',
    countdown: {
      tileBorder: 'border-emerald-200/18',
      tileBg: 'bg-emerald-950/50',
      valueText: 'text-emerald-50',
      labelText: 'text-emerald-200/50',
      liveBorder: 'border-emerald-400/30',
      liveBg: 'bg-emerald-500/10',
      liveText: 'text-emerald-100',
      liveDot: 'bg-emerald-400',
    },
  },
  portola: {
    tagline: 'Deep bass, violet light, and the San Francisco skyline holding the night open.',
    heroImage:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=2400&q=80',
    imagePosition: 'object-[center_35%]',
    colorWash: 'from-violet-600/40 via-fuchsia-600/30 to-indigo-900/35',
    accentGradient: 'from-violet-950/55 via-indigo-950/60 to-forest-950/95',
    scrimGradient: 'from-forest-950/93 via-violet-950/45 to-transparent',
    accentLabel: 'text-violet-200/90',
    accentIcon: 'text-fuchsia-300/85',
    ctaFrom: 'from-fuchsia-400',
    ctaTo: 'to-violet-500',
    ctaShadow: 'shadow-fuchsia-500/30 hover:shadow-fuchsia-500/45',
    monogramBorder: 'border-violet-200/25',
    monogramBg: 'bg-violet-950/45',
    countdown: {
      tileBorder: 'border-violet-300/20',
      tileBg: 'bg-violet-950/55',
      valueText: 'text-violet-50',
      labelText: 'text-violet-200/50',
      liveBorder: 'border-fuchsia-400/35',
      liveBg: 'bg-fuchsia-500/10',
      liveText: 'text-fuchsia-100',
      liveDot: 'bg-fuchsia-400',
    },
  },
  'lightning-in-a-bottle': {
    tagline: 'Lake sunsets, open-hearted workshops, and a camp that feels like chosen family.',
    heroImage:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80',
    imagePosition: 'object-center',
    colorWash: 'from-sky-400/30 via-rose-300/25 to-amber-400/25',
    accentGradient: 'from-sky-950/40 via-indigo-950/50 to-forest-950/90',
    scrimGradient: 'from-forest-950/85 via-sky-950/35 to-transparent',
    accentLabel: 'text-sky-200/90',
    accentIcon: 'text-rose-200/80',
    ctaFrom: 'from-sky-300',
    ctaTo: 'to-rose-300',
    ctaShadow: 'shadow-sky-400/25 hover:shadow-sky-400/40',
    monogramBorder: 'border-sky-200/22',
    monogramBg: 'bg-sky-950/40',
    countdown: {
      tileBorder: 'border-sky-200/18',
      tileBg: 'bg-sky-950/48',
      valueText: 'text-sky-50',
      labelText: 'text-sky-200/50',
      liveBorder: 'border-sky-400/30',
      liveBg: 'bg-sky-500/10',
      liveText: 'text-sky-100',
      liveDot: 'bg-sky-400',
    },
  },
  stagecoach: {
    tagline: 'Tailgate singalongs, amber desert light, and every chorus sung together.',
    heroImage:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=2400&q=80',
    imagePosition: 'object-[center_45%]',
    colorWash: 'from-amber-500/35 via-yellow-600/25 to-orange-700/30',
    accentGradient: 'from-amber-950/45 via-orange-950/55 to-forest-950/90',
    scrimGradient: 'from-forest-950/88 via-amber-950/40 to-transparent',
    accentLabel: 'text-amber-200/90',
    accentIcon: 'text-yellow-300/85',
    ctaFrom: 'from-yellow-300',
    ctaTo: 'to-amber-500',
    ctaShadow: 'shadow-amber-400/30 hover:shadow-amber-400/45',
    monogramBorder: 'border-amber-200/25',
    monogramBg: 'bg-amber-950/42',
    countdown: {
      tileBorder: 'border-amber-200/22',
      tileBg: 'bg-amber-950/50',
      valueText: 'text-amber-50',
      labelText: 'text-amber-200/55',
      liveBorder: 'border-yellow-400/35',
      liveBg: 'bg-yellow-500/10',
      liveText: 'text-yellow-100',
      liveDot: 'bg-yellow-400',
    },
  },
};

const DEFAULT_HERO_DNA: FestivalHeroDna = {
  tagline: 'Music, community, and the kind of weekend you will never forget.',
  heroImage:
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2400&q=80',
  imagePosition: 'object-center',
  colorWash: 'from-amber-500/35 via-orange-500/25 to-forest-950/40',
  accentGradient: 'from-amber-950/40 via-orange-950/50 to-forest-950/90',
  scrimGradient: 'from-forest-950/85 via-forest-950/40 to-transparent',
  accentLabel: 'text-amber-glow/90',
  accentIcon: 'text-amber-glow/80',
  ctaFrom: 'from-amber-glow',
  ctaTo: 'to-amber-deep',
  ctaShadow: 'shadow-amber-glow/30 hover:shadow-amber-glow/45',
  monogramBorder: 'border-white/20',
  monogramBg: 'bg-white/10',
  countdown: {
    tileBorder: 'border-white/15',
    tileBg: 'bg-forest-950/50',
    valueText: 'text-sand-50',
    labelText: 'text-sand-200/50',
    liveBorder: 'border-emerald-400/30',
    liveBg: 'bg-emerald-500/10',
    liveText: 'text-emerald-200',
    liveDot: 'bg-emerald-400',
  },
};

export function getFestivalHeroDna(slug: string): FestivalHeroDna {
  return FESTIVAL_HERO_DNA[slug] ?? DEFAULT_HERO_DNA;
}

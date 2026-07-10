function formatFestivalDates(startsAt: Date, endsAt: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = startsAt.toLocaleDateString('en-US', opts);
  const end = endsAt.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  return `${start} – ${end}`;
}

export { formatFestivalDates };

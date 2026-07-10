import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-forest-950">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-glow to-amber-deep text-sm font-bold text-forest-950">
                FC
              </span>
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
                FestyCamper
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand-200/70">
              The festival-friendly RV marketplace. Book vans that allow festival use, with bundled camping gear and delivery options.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-sand-100">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm text-sand-200/70">
              <li><Link href="/festivals" className="transition-colors hover:text-amber-glow">Featured Festivals</Link></li>
              <li><Link href="/#vans" className="transition-colors hover:text-amber-glow">Featured Vans</Link></li>
              <li><Link href="/#how-it-works" className="transition-colors hover:text-amber-glow">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-sand-100">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-sand-200/70">
              <li><Link href="/list-your-van" className="transition-colors hover:text-amber-glow">List Your Van</Link></li>
              <li><Link href="/admin" className="transition-colors hover:text-amber-glow">Admin</Link></li>
              <li><a href="mailto:hello@festycamper.com" className="transition-colors hover:text-amber-glow">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-sand-200/50">© {new Date().getFullYear()} FestyCamper. All rights reserved.</p>
          <p className="text-sm text-sand-200/50">Built for festival weekends under the stars.</p>
        </div>
      </div>
    </footer>
  );
}

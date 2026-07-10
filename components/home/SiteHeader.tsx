import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-forest-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-glow to-amber-deep text-sm font-bold text-forest-950 shadow-lg shadow-amber-glow/20 transition-transform duration-300 group-hover:scale-105">
            FC
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-sand-50">
            FestyCamper
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/festivals" className="text-sm font-medium text-sand-200/80 transition-colors duration-200 hover:text-amber-glow">
            Festivals
          </Link>
          <Link href="/#vans" className="text-sm font-medium text-sand-200/80 transition-colors duration-200 hover:text-amber-glow">
            Vans
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-sand-200/80 transition-colors duration-200 hover:text-amber-glow">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/owner/login"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-sand-100 transition-all duration-300 hover:border-amber-glow/40 hover:bg-white/5 sm:inline-flex"
          >
            Owner Login
          </Link>
          <Link
            href="/list-your-van"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-sand-100 transition-all duration-300 hover:border-amber-glow/40 hover:bg-white/5 sm:inline-flex"
          >
            List Your Van
          </Link>
          <Link
            href="/festivals"
            className="rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-4 py-2 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-glow/35"
          >
            Browse Festivals
          </Link>
        </div>
      </div>
    </header>
  );
}

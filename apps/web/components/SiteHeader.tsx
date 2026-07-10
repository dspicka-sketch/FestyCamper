import Link from "next/link";

const links = [
  { href: "/forecast", label: "Today's Forecast" },
  { href: "/report", label: "Catch Report" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ocean-800/80 bg-ocean-950/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-2xl tracking-tight text-sand-100">
          SurfScore
        </Link>
        <nav className="flex items-center gap-6 text-sm text-sand-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#beta"
            className="rounded-full bg-ocean-500 px-4 py-2 font-medium text-white hover:bg-ocean-400 transition-colors"
          >
            Join Beta
          </Link>
        </nav>
      </div>
    </header>
  );
}

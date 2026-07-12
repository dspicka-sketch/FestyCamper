import Link from "next/link";
import { BetaSignupForm } from "@/components/BetaSignupForm";

const features = [
  "Daily Sonoma Coast fishing forecast",
  "1–10 Surf Score with Go / Maybe / No-Go",
  "Best beach + two-hour window",
  "Tide, swell, wind & fish behavior",
  "Tackle recommendations & safety warnings",
  "Seven-day outlook & catch reports",
];

const beaches = [
  "Doran Beach",
  "Doran Jetty",
  "Dillon Beach",
  "Portuguese Beach",
  "Wrights Beach",
  "Shorttail Gulch",
  "Pinnacle Gulch",
  "Duncan's Cove",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ocean-800">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-950 to-ocean-950" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-ocean-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-ocean-300">
            Closed Beta — Sonoma Coast
          </p>
          <h1 className="font-display max-w-3xl text-4xl leading-tight text-sand-50 sm:text-6xl">
            Know when to go surf fishing — before you drive to the coast.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-sand-200">
            SurfScore combines tide, swell, wind, and fish behavior into a
            deterministic 1–10 score, best-beach pick, and two-hour fishing
            window for eight Sonoma Coast spots.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/forecast"
              className="rounded-full bg-ocean-500 px-6 py-3 font-semibold text-white hover:bg-ocean-400 transition-colors"
            >
              View Today&apos;s Forecast
            </Link>
            <a
              href="#beta"
              className="rounded-full border border-ocean-600 px-6 py-3 font-semibold text-sand-100 hover:border-ocean-400 transition-colors"
            >
              Join the Beta
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-sand-100">What you get</h2>
            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sand-200">
                  <span className="mt-1 text-ocean-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-sand-100">Beta beaches</h2>
            <p className="mt-3 text-sand-300">
              Eight Sonoma Coast locations at launch. Salmon Creek is excluded
              from recommendations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {beaches.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-ocean-700 bg-ocean-900/60 px-3 py-1 text-sm text-sand-200"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="beta" className="border-t border-ocean-800 bg-ocean-900/40">
        <div className="mx-auto max-w-xl px-4 py-16">
          <h2 className="font-display text-center text-3xl text-sand-100">
            Request beta access
          </h2>
          <p className="mt-3 text-center text-sand-300">
            Limited spots for Sonoma Coast surf anglers. No spam — one email when
            you&apos;re in.
          </p>
          <div className="mt-8">
            <BetaSignupForm />
          </div>
        </div>
      </section>
    </>
  );
}

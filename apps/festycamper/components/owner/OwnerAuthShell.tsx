import Link from 'next/link';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

type OwnerAuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function OwnerAuthShell({ title, subtitle, children, footer }: OwnerAuthShellProps) {
  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-md px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Owner account</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sand-200/70">{subtitle}</p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-forest-900/60 p-6 sm:p-8">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-sand-200/60">{footer}</div>}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-amber-glow transition-colors hover:text-amber-glow/80">
      {children}
    </Link>
  );
}

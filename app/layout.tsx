import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: 'FestyCamper',
  description: 'Festival-friendly RV rentals and bundled camping packages.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

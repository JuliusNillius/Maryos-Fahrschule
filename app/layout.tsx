import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import {
  Barlow_Condensed,
  Inter,
  Orbitron,
} from 'next/font/google';
import './globals.css';
import JsonLd from '@/components/layout/JsonLd';
import LenisProvider from '@/components/providers/LenisProvider';
import ReloadToStart from '@/components/ReloadToStart';

// §03 Heading: Barlow Condensed 700 Italic — ALL CAPS
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  style: ['italic'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

// §03 Body: Inter 400/500
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

// §03 Mono / numbers + stats: Orbitron 700
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maryosfahrschule.de'),
  title: { default: "Maryo's Fahrschule | Mönchengladbach", template: "%s | Maryo's Fahrschule" },
  description: "Fahrschule in Mönchengladbach. Führerschein PKW Klasse B & BF17. 5.0 ★ Google.",
  robots: { index: true, follow: true },
  icons: {
    apple: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080808',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html
      lang="de"
      className={`${barlowCondensed.variable} ${inter.variable} ${orbitron.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
        <LenisProvider>
          <ReloadToStart />
          <JsonLd />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

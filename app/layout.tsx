import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import {
  Barlow_Condensed,
  Inter,
  Orbitron,
} from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/providers/LenisProvider';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maryosfahrschule.de'),
  title: { default: "Maryo's Fahrschule | Mönchengladbach", template: "%s | Maryo's Fahrschule" },
  description: "Fahrschule in Mönchengladbach. Führerschein PKW Klasse B & BF17. 5.0 ★ Google.",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080808',
};

function heroVideoPreloadHrefs() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maryosfahrschule.de').replace(
    /\/$/,
    '',
  );
  const desktop =
    process.env.NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL?.trim() || `${site}/videos/hero.mp4`;
  const mobile =
    process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL?.trim() || `${site}/videos/hero-mobile.mp4`;
  return { desktop, mobile };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const { desktop: heroDesktop, mobile: heroMobile } = heroVideoPreloadHrefs();

  return (
    <html
      lang="de"
      className={`${barlowCondensed.variable} ${inter.variable} ${orbitron.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="preload"
          href={heroDesktop}
          as="video"
          type="video/mp4"
          media="(min-width: 1024px)"
        />
        <link
          rel="preload"
          href={heroMobile}
          as="video"
          type="video/mp4"
          media="(max-width: 1023px)"
        />
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
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

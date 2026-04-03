const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** Baseline-CSP (Next.js braucht weiterhin unsafe-inline für Hydration-Chunks). Nur in Production. */
function contentSecurityPolicy() {
  if (process.env.NODE_ENV !== 'production') return null;
  if (process.env.CSP_DISABLE === '1') return null;
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.stripe.com https://plausible.io https://cdn.sanity.io https://www.google.com https://maps.googleapis.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.stripe.com https://www.google.com https://*.google.com",
    // Externe Hero-Videos (z. B. Supabase Storage, CDN) — https: erlaubt
    "media-src 'self' blob: https:",
    "worker-src 'self' blob:",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'self'",
  ].join('; ');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gsap'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      // Supabase Storage Public URLs (Bilder aus Backoffice-Uploads)
      { protocol: 'https', hostname: 'alsiyzkemxhsbeyqqbuq.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/documents', destination: '/documents/index.html', permanent: false },
      { source: '/documents/', destination: '/documents/index.html', permanent: false },
    ];
  },
  async headers() {
    const csp = contentSecurityPolicy();
    const base = [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
    if (csp) {
      base.push({
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      });
    }
    return base;
  },
};

module.exports = withNextIntl(nextConfig);

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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
    ],
  },
  async redirects() {
    return [
      { source: '/documents', destination: '/documents/index.html', permanent: false },
      { source: '/documents/', destination: '/documents/index.html', permanent: false },
    ];
  },
};

module.exports = withNextIntl(nextConfig);

import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

// Add a host to img-src / connect-src only if something on the site actually needs it.
// If an image or map stops loading after this change, the browser console will name the blocked host.
const csp = [
  "default-src 'self'",
  // 'unsafe-eval' only in dev (Next hot reload). 'unsafe-inline' stays until you move to nonces.
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com${isDev ? ' ws: wss:' : ''}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob: https://challenges.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // No "preload": it is very hard to undo. Add it later only when every subdomain is permanently HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1', 'localhost', '127.0.0.1'],
  poweredByHeader: false,

  // Makes sure the protected file is bundled with the download route on Vercel and similar hosts.
  outputFileTracingIncludes: {
    '/api/brochure/download': ['./protected-assets/**/*'],
  },

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // Admin and API responses should never be cached by browsers or proxies.
      { source: '/api/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/admin', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// CSP só em produção. Em dev, manter mínimo pra não bloquear HMR/assets em LAN.
// Os requisitos de security_instructions.md são pra ambiente público; dev é
// auto-hospedado em rede confiável.
const cspProd = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  // Permite embed do iZurvive em /mapa-oficial — fonte oficial da comunidade.
  // Single-origin allowlist; sandbox aplicado no iframe ainda restringe.
  "frame-src https://www.izurvive.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // 'standalone' só se aplica a self-host (Docker). Vercel usa seu próprio
  // handler e ignora esse output. Liga só quando NÃO está em Vercel.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  reactStrictMode: true,
  poweredByHeader: false,
  // Next.js 16 bloqueia assets vindos de origens não declaradas (anti-DNS-rebind).
  // Liste hostnames exatos da LAN — sem scheme, sem porta, sem CIDR.
  allowedDevOrigins: [
    "192.168.230.241",
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
  ],
  experimental: {
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [],
  },
  async headers() {
    // Em dev: zero headers de segurança — só os de cache funcionais.
    // Em prod: stack completo conforme security_instructions.md.
    if (isDev) {
      return [
        {
          source: "/fonts/:path*",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          ],
        },
      ];
    }

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: cspProd },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;

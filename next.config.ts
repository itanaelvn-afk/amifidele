import type { NextConfig } from "next";

/**
 * Hôtes images catalogue (audit Mongo 2026-03).
 * Aligné avec `KNOWN_PRODUCT_IMAGE_HOSTS` dans `src/lib/product-image.ts`.
 */
const PRODUCT_IMAGE_HOSTS = [
  "media.os.fressnapf.com",
  "webcdn.vivara.com",
  "images2.productserve.com",
  "images.productserve.com",
] as const;

const nextConfig: NextConfig = {
  images: {
    /**
     * Pas d'optimisation Vercel (CDN marchands + coûts).
     * Quick wins : resize via CDN dans `src/lib/product-image.ts`.
     * `remotePatterns` prépare une phase 2 (`unoptimized: false`).
     */
    unoptimized: true,
    remotePatterns: PRODUCT_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.amifidele.fr",
          },
        ],
        destination: "https://amifidele.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

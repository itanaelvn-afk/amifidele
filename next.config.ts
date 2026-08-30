import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Pas d'optimisation Vercel (CDN marchands hétérogènes).
     * Remplace le loader custom qui déclenchait
     * `next-image-missing-loader-width` dès qu'il ignorait `width`.
     */
    unoptimized: true,
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

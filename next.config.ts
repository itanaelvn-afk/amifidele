import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // Vide : les domaines marchands sont hétérogènes ; le loader renvoie l'URL telle quelle.
    remotePatterns: [],
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

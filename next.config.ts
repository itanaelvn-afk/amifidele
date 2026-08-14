import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Awin ProductServe (images, images2, …)
      { protocol: "https", hostname: "**.productserve.com", pathname: "/**" },
      // MaxiZoo / Fressnapf
      { protocol: "https", hostname: "**.fressnapf.com", pathname: "/**" },
      // Vivara
      { protocol: "https", hostname: "**.vivara.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;

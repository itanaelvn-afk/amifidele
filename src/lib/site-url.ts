/**
 * Origine publique du site (sans slash final).
 * Sert au sitemap, robots.txt et metadataBase.
 */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) {
    return withHttps(vercelProd);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return withHttps(vercelUrl);
  }

  return "http://localhost:3000";
}

function withHttps(hostOrUrl: string): string {
  if (/^https?:\/\//i.test(hostOrUrl)) {
    return hostOrUrl.replace(/\/+$/, "");
  }
  return `https://${hostOrUrl.replace(/\/+$/, "")}`;
}

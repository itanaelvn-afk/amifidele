import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}

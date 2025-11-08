import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Amifidele - Comparateur de produits pour animaux",
  description: "Comparez les meilleurs produits pour vos animaux de compagnie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

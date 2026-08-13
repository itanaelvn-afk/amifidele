import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "AmiFidele - Comparateur de produits pour animaux",
  description:
    "Comparez les prix et les caractéristiques de milliers de produits pour chiens et chats chez les meilleurs marchands.",
};

export default function Home() {
  return (
    <SiteChrome current="home">
      <HomePage />
    </SiteChrome>
  );
}

import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export default function CategoryNotFound() {
  return (
    <SiteChrome>
      <main className="container mx-auto px-4 py-20 max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-3">Catégorie introuvable</h1>
        <p className="text-muted-foreground mb-6">
          Cette page ne correspond pas à une catégorie AmiFidele.
        </p>
        <Link href="/produits" className="text-primary hover:underline">
          Voir le catalogue
        </Link>
      </main>
    </SiteChrome>
  );
}

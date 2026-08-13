import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export default function ProduitNotFound() {
  return (
    <SiteChrome>
      <main className="container mx-auto px-4 py-20 max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-3">Produit introuvable</h1>
        <p className="text-muted-foreground mb-6">
          Cette fiche n&apos;existe pas ou n&apos;est plus visible sur AmiFidele.
        </p>
        <Link href="/produits" className="text-primary hover:underline">
          Voir le catalogue
        </Link>
        {" · "}
        <Link href="/" className="text-primary hover:underline">
          Retour à l&apos;accueil
        </Link>
      </main>
    </SiteChrome>
  );
}

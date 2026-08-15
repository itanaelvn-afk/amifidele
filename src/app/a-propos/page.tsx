import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "À propos | AmiFidele",
  description:
    "Découvrez AmiFidele : un comparateur indépendant pour choisir les meilleurs produits pour chiens et chats.",
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <SiteChrome current="apropos">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">À propos d&apos;AmiFidele</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          AmiFidele aide les propriétaires d&apos;animaux à comparer des offres
          pour chiens et chats, clairement et sans pression d&apos;achat.
        </p>

        <section className="mb-12 space-y-3">
          <h2 className="text-xl font-semibold">Notre mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rassembler des produits et des prix de marchands partenaires pour
            faciliter le choix : alimentation, hygiène, accessoires et plus
            encore. Nous ne vendons pas les articles ; nous orientons vers les
            boutiques qui les proposent.
          </p>
        </section>

        <section className="mb-12 space-y-3">
          <h2 className="text-xl font-semibold">Pour qui ?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour les particuliers qui veulent comparer avant d&apos;acheter,
            gagner du temps, et vérifier prix ou disponibilité chez plusieurs
            enseignes — que vous ayez un chat, un chien, ou les deux.
          </p>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-xl font-semibold">Nos engagements</h2>
          <ul className="space-y-4 text-muted-foreground leading-relaxed">
            <li>
              <strong className="text-foreground">Transparence</strong> — les
              liens vers les marchands peuvent être affiliés : si vous achetez
              via AmiFidele, nous pouvons percevoir une commission, sans
              surcoût pour vous.
            </li>
            <li>
              <strong className="text-foreground">Indépendance éditoriale</strong>{" "}
              — le catalogue et les fiches visent à informer ; AmiFidele
              n&apos;est pas le vendeur des produits présentés.
            </li>
            <li>
              <strong className="text-foreground">Simplicité</strong> — un
              parcours clair pour trouver, comparer et ouvrir la boutique du
              partenaire en un clic.
            </li>
          </ul>
        </section>

        <section className="mb-12 space-y-3">
          <h2 className="text-xl font-semibold">Une question ?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Une suggestion, un produit manquant ou un souci technique : écrivez-nous
            via la page Contact. Nous lisons les messages avec attention.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/produits">Voir le catalogue</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Accueil</Link>
          </Button>
        </div>
      </main>
    </SiteChrome>
  );
}

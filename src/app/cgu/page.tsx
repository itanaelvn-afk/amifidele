import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Conditions générales d'utilisation | AmiFidele",
  description:
    "Conditions générales d'utilisation (CGU) du comparateur AmiFidele.",
  path: "/cgu",
});

export default function CguPage() {
  return (
    <LegalPageShell title="Conditions générales d'utilisation">
      <LegalSection title="1. Objet">
        <p>
          Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et
          l&apos;utilisation du site AmiFidele. En naviguant sur le Site, vous acceptez ces CGU.
        </p>
      </LegalSection>

      <LegalSection title="2. Description du service">
        <p>
          AmiFidele propose un service gratuit de comparaison d&apos;offres pour produits destinés
          aux animaux de compagnie. Le Site peut contenir des liens d&apos;affiliation : si vous
          achetez chez un marchand via ces liens, AmiFidele peut percevoir une commission, sans
          surcoût pour vous.
        </p>
      </LegalSection>

      <LegalSection title="3. Accès au site">
        <p>
          L&apos;accès au Site est libre. AmiFidele se réserve le droit de suspendre ou modifier
          tout ou partie du service, notamment pour maintenance ou évolution.
        </p>
      </LegalSection>

      <LegalSection title="4. Utilisation acceptable">
        <p>Vous vous engagez à ne pas :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>utiliser le Site de manière frauduleuse ou abusive ;</li>
          <li>perturber le fonctionnement technique du Site ;</li>
          <li>extraire massivement les données (scraping) sans autorisation ;</li>
          <li>usurper l&apos;identité d&apos;AmiFidele ou de ses partenaires.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Contenu et offres partenaires">
        <p>
          Les fiches produits et prix proviennent de sources partenaires (feeds). AmiFidele
          s&apos;efforce de présenter des informations à jour, sans garantie d&apos;exhaustivité.
          Les conditions de vente applicables sont celles du marchand chez qui vous commandez.
        </p>
      </LegalSection>

      <LegalSection title="6. Propriété intellectuelle">
        <p>
          Sauf mention contraire, les contenus éditoriaux et l&apos;interface du Site sont
          protégés. Toute réutilisation commerciale non autorisée est interdite.
        </p>
      </LegalSection>

      <LegalSection title="7. Responsabilité">
        <p>
          Dans les limites autorisées par la loi, AmiFidele ne saurait être responsable des
          dommages indirects liés à l&apos;utilisation du Site ou aux achats effectués chez des
          tiers.
        </p>
      </LegalSection>

      <LegalSection title="8. Données personnelles">
        <p>
          En V1, AmiFidele ne collecte pas volontairement de données
          personnelles des visiteurs. Le détail (et les évolutions futures) est
          décrit dans la{" "}
          <Link className="text-primary hover:underline" href="/confidentialite">
            Politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable">
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut
          d&apos;accord amiable, les tribunaux français seront compétents.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

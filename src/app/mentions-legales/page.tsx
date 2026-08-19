import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { LEGAL_HOSTING, LEGAL_PUBLISHER } from "@/lib/legal-publisher";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mentions légales | AmiFidele",
  description:
    "Mentions légales du site AmiFidele, comparateur de produits pour animaux de compagnie.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <LegalPageShell title="Mentions légales">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le site <strong>AmiFidele</strong> (ci-après « le Site ») est édité par{" "}
          <strong>{LEGAL_PUBLISHER.fullName}</strong>, personne physique.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Contact :{" "}
            <a
              className="text-primary hover:underline"
              href={`mailto:${LEGAL_PUBLISHER.contactEmail}`}
            >
              {LEGAL_PUBLISHER.contactEmail}
            </a>
          </li>
          <li>
            Directeur de la publication : {LEGAL_PUBLISHER.directorOfPublication}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Hébergement">
        <p>
          Le Site est hébergé par <strong>{LEGAL_HOSTING.name}</strong>,{" "}
          {LEGAL_HOSTING.address} (
          <a
            className="text-primary hover:underline"
            href={LEGAL_HOSTING.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="3. Objet du site">
        <p>
          AmiFidele est un <strong>comparateur indépendant</strong> de produits pour animaux de
          compagnie. Il permet de consulter des offres provenant de marchands partenaires et de
          comparer prix, caractéristiques et disponibilité.
        </p>
        <p>
          AmiFidele n&apos;est pas le vendeur des produits présentés. Les commandes sont passées
          auprès des marchands via des liens (notamment d&apos;affiliation).
        </p>
      </LegalSection>

      <LegalSection title="4. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du Site (marque AmiFidele, textes, structure, design,
          logos) est protégé. Toute reproduction non autorisée est interdite.
        </p>
        <p>
          Les noms, marques et visuels des produits et marchands restent la propriété de leurs
          titulaires respectifs.
        </p>
      </LegalSection>

      <LegalSection title="5. Limitation de responsabilité">
        <p>
          Les informations affichées (prix, stocks, descriptions) sont fournies à titre indicatif
          à partir de feeds partenaires. Elles peuvent évoluer sans préavis. AmiFidele ne garantit
          pas l&apos;exactitude exhaustive des données et ne saurait être tenu responsable des
          transactions conclues avec les marchands.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          Pour toute question relative aux présentes mentions :{" "}
          <a
            className="text-primary hover:underline"
            href={`mailto:${LEGAL_PUBLISHER.contactEmail}`}
          >
            {LEGAL_PUBLISHER.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

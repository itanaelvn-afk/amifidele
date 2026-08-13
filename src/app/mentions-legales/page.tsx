import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
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
          Le site <strong>AmiFidele</strong> (ci-après « le Site ») est édité par :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Raison sociale / nom : <em>[À compléter]</em></li>
          <li>Forme juridique : <em>[À compléter]</em></li>
          <li>Capital social : <em>[À compléter]</em></li>
          <li>Siège social : <em>[À compléter — adresse]</em></li>
          <li>RCS / SIREN : <em>[À compléter]</em></li>
          <li>N° TVA intracommunautaire : <em>[À compléter si applicable]</em></li>
          <li>
            Contact :{" "}
            <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
              contact@amifidele.fr
            </a>
          </li>
          <li>Directeur de la publication : <em>[À compléter]</em></li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Hébergement">
        <p>
          Le Site est hébergé par : <em>[À compléter — prestataire, adresse, contact]</em>.
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
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

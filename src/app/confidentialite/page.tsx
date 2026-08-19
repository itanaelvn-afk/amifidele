import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { LEGAL_PUBLISHER } from "@/lib/legal-publisher";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Politique de confidentialité | AmiFidele",
  description:
    "Politique de confidentialité et protection des données personnelles sur AmiFidele.",
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <LegalPageShell title="Politique de confidentialité">
      <LegalSection title="1. Périmètre actuel (V1)">
        <p>
          AmiFidele{" "}
          <strong>collecte des données personnelles uniquement</strong> lorsque
          vous utilisez le{" "}
          <Link className="text-primary hover:underline" href="/contact">
            formulaire de contact
          </Link>
          . Pas de compte utilisateur, pas de newsletter, pas d&apos;outil
          d&apos;analytics déployé par AmiFidele.
        </p>
      </LegalSection>

      <LegalSection title="2. Responsable du traitement">
        <p>
          Le responsable du traitement est l&apos;éditeur du Site AmiFidele,{" "}
          <strong>{LEGAL_PUBLISHER.fullName}</strong>, contact{" "}
          <a
            className="text-primary hover:underline"
            href={`mailto:${LEGAL_PUBLISHER.contactEmail}`}
          >
            {LEGAL_PUBLISHER.contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Données traitées">
        <p>
          <strong>Formulaire de contact</strong> : nom, adresse e-mail et
          contenu du message, uniquement pour répondre à votre demande. Base
          légale : intérêt légitime (traiter les demandes) et/ou exécution de
          mesures précontractuelles à votre initiative.
        </p>
        <p>
          <strong>Conservation</strong> : le temps nécessaire au traitement de
          la demande, puis suppression ou archivage limité au-delà si une
          obligation légale l&apos;exige.
        </p>
        <p>
          <strong>Sous-traitant technique</strong> : l&apos;envoi peut
          transiter par Formspree (prestataire de formulaires), selon la
          configuration du Site. Des logs techniques d&apos;hébergement (IP,
          horodatage, user-agent) peuvent aussi apparaître chez l&apos;hébergeur.
        </p>
        <p>
          <strong>Non traités</strong> : newsletter, profils utilisateurs,
          cookies analytics ou publicitaires déposés par AmiFidele. Les achats
          et paiements se font chez les marchands partenaires.
        </p>
      </LegalSection>

      <LegalSection title="4. Affiliation et sites tiers">
        <p>
          Lorsque vous cliquez vers un marchand via un lien d&apos;affiliation
          (ex. réseau Awin), vous quittez le Site. Le marchand et/ou le réseau
          d&apos;affiliation peuvent alors traiter des données et déposer des
          cookies selon leurs propres politiques, hors du contrôle direct
          d&apos;AmiFidele.
        </p>
      </LegalSection>

      <LegalSection title="5. Vos droits">
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
          rectification, d&apos;effacement, de limitation, d&apos;opposition et
          de portabilité, ainsi que du droit d&apos;introduire une réclamation
          auprès de la CNIL (
          <a
            className="text-primary hover:underline"
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr
          </a>
          ).
        </p>
        <p>
          Pour toute demande :{" "}
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>{" "}
          ou le{" "}
          <Link className="text-primary hover:underline" href="/contact">
            formulaire de contact
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>
          Pour le détail des cookies et de vos choix, consultez la{" "}
          <Link className="text-primary hover:underline" href="/cookies">
            Gestion des cookies
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

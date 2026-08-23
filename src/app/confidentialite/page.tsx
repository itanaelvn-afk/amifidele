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
      <LegalSection title="1. Périmètre actuel">
        <p>
          AmiFidele{" "}
          <strong>collecte des données personnelles</strong> lorsque vous
          utilisez le{" "}
          <Link className="text-primary hover:underline" href="/contact">
            formulaire de contact
          </Link>{" "}
          et, si vous y consentez, via{" "}
          <strong>Google Analytics 4</strong> (mesure d&apos;audience). Pas de
          compte utilisateur, pas de newsletter.
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
          <strong>Mesure d&apos;audience (Google Analytics 4)</strong> — si vous
          acceptez la catégorie « Mesure d&apos;audience » : pages consultées,
          événements de navigation (ex. clic affilié), identifiant client
          (cookies <code className="text-sm">_ga</code> /{" "}
          <code className="text-sm">_ga_*</code>), adresse IP anonymisée selon
          la configuration Google. Finalité : statistiques et amélioration du
          Site. Base légale : consentement. Durée : jusqu&apos;à environ 13
          mois pour les cookies analytics. Sous-traitant : Google (voir{" "}
          <a
            className="text-primary hover:underline"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            politique Google
          </a>
          ). Sans consentement, aucun script analytics n&apos;est chargé.
        </p>
        <p>
          <strong>Non traités</strong> : newsletter, profils utilisateurs,
          cookies publicitaires déposés par AmiFidele. Les achats et paiements
          se font chez les marchands partenaires.
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

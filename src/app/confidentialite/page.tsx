import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Politique de confidentialité | AmiFidele",
  description:
    "Politique de confidentialité et protection des données personnelles sur AmiFidele.",
};

export default function ConfidentialitePage() {
  return (
    <LegalPageShell title="Politique de confidentialité">
      <LegalSection title="1. Périmètre actuel (V1)">
        <p>
          En l&apos;état actuel du Site, AmiFidele{" "}
          <strong>ne collecte pas volontairement de données personnelles</strong>{" "}
          des visiteurs : pas de compte utilisateur, pas de formulaire de
          contact actif, pas de newsletter branchée, pas d&apos;outil
          d&apos;analytics déployé.
        </p>
        <p>
          Cette politique décrit ce qui s&apos;applique aujourd&apos;hui et ce
          qui sera mis à jour si une collecte est introduite plus tard.
        </p>
      </LegalSection>

      <LegalSection title="2. Responsable du traitement">
        <p>
          Lorsqu&apos;un traitement de données personnelles sera mis en place,
          le responsable du traitement sera l&apos;éditeur du Site AmiFidele :{" "}
          <em>[À compléter — identité / coordonnées]</em>, contact{" "}
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Données susceptibles d’être traitées">
        <p>
          <strong>Aujourd&apos;hui</strong>, seuls des éléments techniques
          liés au fonctionnement du Site ou de l&apos;infrastructure peuvent
          apparaître de façon accessoire (ex. logs serveur de l&apos;hébergeur :
          adresse IP, horodatage, user-agent), selon la configuration de
          l&apos;hébergement.
        </p>
        <p>
          <strong>Pas traités pour le moment</strong> : adresse e-mail
          newsletter, messages de formulaire de contact, profils utilisateurs,
          cookies analytics ou publicitaires déposés par AmiFidele.
        </p>
        <p>
          AmiFidele ne traite pas les données de paiement : les achats se font
          chez les marchands partenaires.
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

      <LegalSection title="5. Finalités (si collecte ultérieure)">
        <p>
          Si AmiFidele introduit une collecte (contact, newsletter, mesure
          d&apos;audience, etc.), les finalités, bases légales, destinataires et
          durées de conservation seront précisées ici avant mise en service, et
          le consentement sera recueilli lorsque la loi l&apos;exige.
        </p>
      </LegalSection>

      <LegalSection title="6. Vos droits">
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
          ), dès lors qu&apos;un traitement vous concernant existe.
        </p>
        <p>
          Pour toute demande :{" "}
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies">
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

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
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données collectées via le Site est l&apos;éditeur
          AmiFidele : <em>[À compléter — identité / coordonnées]</em>, contact{" "}
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>Selon votre usage du Site, nous pouvons traiter :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>données de navigation (pages vues, appareil, logs techniques) ;</li>
          <li>adresse e-mail si vous vous inscrivez à une newsletter ;</li>
          <li>messages envoyés via un formulaire de contact (lorsqu&apos;il sera disponible) ;</li>
          <li>cookies et traceurs (voir la page Gestion des cookies).</li>
        </ul>
        <p>
          AmiFidele ne traite pas les données de paiement : les achats se font chez les
          marchands partenaires.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalités">
        <ul className="list-disc pl-5 space-y-1">
          <li>fournir et améliorer le service de comparaison ;</li>
          <li>mesurer l&apos;audience et la performance du Site (si consentement requis) ;</li>
          <li>répondre à vos demandes de contact ;</li>
          <li>envoyer des communications si vous y avez consenti ;</li>
          <li>prévenir la fraude et assurer la sécurité du Site.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Bases légales">
        <p>
          Selon les cas : intérêt légitime (fonctionnement du Site), consentement (cookies non
          essentiels, newsletter), ou exécution de mesures précontractuelles / obligation légale.
        </p>
      </LegalSection>

      <LegalSection title="5. Destinataires">
        <p>
          Les données peuvent être accessibles à l&apos;éditeur, à ses prestataires techniques
          (hébergement, analytics) et, le cas échéant, aux autorités lorsque la loi l&apos;exige.
          Les clics vers un marchand peuvent être tracés par le réseau d&apos;affiliation (ex.
          Awin) selon leurs politiques.
        </p>
      </LegalSection>

      <LegalSection title="6. Durées de conservation">
        <p>
          Les données sont conservées le temps nécessaire aux finalités ci-dessus, puis
          archivées ou supprimées. Les logs techniques sont en général conservés pour une durée
          limitée (ex. quelques mois), sauf obligation légale contraire.
        </p>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation, d&apos;opposition et de portabilité, ainsi que du
          droit d&apos;introduire une réclamation auprès de la CNIL (
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
          Pour exercer vos droits :{" "}
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
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

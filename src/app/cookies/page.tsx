import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Gestion des cookies | AmiFidele",
  description:
    "Information sur les cookies utilisés par AmiFidele et gestion de vos préférences.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Gestion des cookies">
      <LegalSection title="1. Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier déposé sur votre terminal lors de la visite d&apos;un
          site. Il permet de mémoriser des informations relatives à votre navigation.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies utilisés sur AmiFidele">
        <p>Selon la configuration du Site, nous pouvons utiliser :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Cookies nécessaires</strong> : fonctionnement technique (session, sécurité,
            préférences essentielles).
          </li>
          <li>
            <strong>Cookies de mesure d&apos;audience</strong> : statistiques de fréquentation
            (déposés uniquement avec votre consentement lorsqu&apos;il est requis).
          </li>
          <li>
            <strong>Cookies liés à l&apos;affiliation</strong> : lors d&apos;un clic vers un
            marchand, le réseau d&apos;affiliation (ex. Awin) peut déposer ses propres cookies
            pour attribuer une commission.
          </li>
        </ul>
        <p>
          La liste exacte des cookies sera mise à jour lorsque les outils d&apos;analytics /
          bannière de consentement seront en place.
        </p>
      </LegalSection>

      <LegalSection title="3. Gestion de vos choix">
        <p>Vous pouvez à tout moment :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>paramétrer votre navigateur pour refuser ou supprimer les cookies ;</li>
          <li>
            utiliser, lorsqu&apos;elle sera disponible, la bannière / le panneau de préférences
            cookies du Site.
          </li>
        </ul>
        <p>
          Le refus de certains cookies peut limiter certaines fonctionnalités (ex. mesure
          d&apos;audience), sans empêcher la consultation des offres.
        </p>
      </LegalSection>

      <LegalSection title="4. Durée">
        <p>
          Les cookies ont une durée de vie limitée (session ou durée déterminée, en général
          inférieure à 13 mois pour les cookies de mesure d&apos;audience soumis à
          consentement).
        </p>
      </LegalSection>

      <LegalSection title="5. En savoir plus">
        <p>
          Pour la protection de vos données personnelles, voir la{" "}
          <Link className="text-primary hover:underline" href="/confidentialite">
            Politique de confidentialité
          </Link>
          . Contact :{" "}
          <a className="text-primary hover:underline" href="mailto:contact@amifidele.fr">
            contact@amifidele.fr
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

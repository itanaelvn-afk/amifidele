import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gestion des cookies | AmiFidele",
  description:
    "Information sur les cookies utilisés par AmiFidele et gestion de vos préférences.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPageShell title="Gestion des cookies">
      <LegalSection title="1. Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier déposé sur votre terminal lors de la
          visite d&apos;un site. Il permet de mémoriser des informations
          relatives à votre navigation.
        </p>
      </LegalSection>

      <LegalSection title="2. Situation actuelle (V1)">
        <p>
          En l&apos;état, AmiFidele{" "}
          <strong>
            ne dépose pas volontairement de cookies analytics ni publicitaires
          </strong>{" "}
          sur le Site. Aucune bannière de consentement n&apos;est encore
          déployée, faute de traceurs non essentiels côté AmiFidele.
        </p>
        <p>
          Des cookies techniques strictement nécessaires au fonctionnement
          (ex. sécurité, préférences essentielles) pourront être utilisés si le
          framework ou l&apos;hébergeur le requiert.
        </p>
      </LegalSection>

      <LegalSection title="3. Affiliation (sites tiers)">
        <p>
          Lors d&apos;un clic vers un marchand, le réseau d&apos;affiliation
          (ex. Awin) et/ou le marchand peuvent déposer leurs propres cookies
          pour attribuer une commission. Ces dépôts relèvent de leurs sites /
          politiques, pas d&apos;un bandeau cookie AmiFidele.
        </p>
      </LegalSection>

      <LegalSection title="4. Évolutions prévues">
        <p>
          Si des cookies de mesure d&apos;audience ou marketing sont ajoutés
          plus tard, cette page sera mise à jour (liste des cookies, finalités,
          durées) et un mécanisme de consentement sera mis en place lorsque la
          réglementation l&apos;exige.
        </p>
      </LegalSection>

      <LegalSection title="5. Gestion de vos choix">
        <p>Vous pouvez à tout moment :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            paramétrer votre navigateur pour refuser ou supprimer les cookies ;
          </li>
          <li>
            utiliser, lorsqu&apos;elle sera disponible, la bannière / le panneau
            de préférences cookies du Site.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. En savoir plus">
        <p>
          Pour la protection des données personnelles, voir la{" "}
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

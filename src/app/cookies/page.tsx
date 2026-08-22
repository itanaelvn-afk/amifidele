import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
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
          relatives à votre navigation. AmiFidele mémorise aussi vos choix de
          consentement dans le{" "}
          <strong>stockage local</strong> du navigateur (localStorage).
        </p>
      </LegalSection>

      <LegalSection title="2. Catégories utilisées">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Nécessaires</strong> — mémorisation de vos préférences de
            consentement et fonctionnement technique du Site. Toujours actifs.
          </li>
          <li>
            <strong>Mesure d&apos;audience</strong> — statistiques de visite
            (ex. Plausible, GA4).{" "}
            <em>Aucun script n&apos;est chargé tant que vous n&apos;avez pas
            consenti et qu&apos;un outil n&apos;est pas configuré.</em>
          </li>
          <li>
            <strong>Marketing</strong> — publicité / widgets display.{" "}
            <em>Aucun script n&apos;est chargé pour l&apos;instant.</em>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Situation actuelle (V1)">
        <p>
          En V1, AmiFidele{" "}
          <strong>
            ne dépose pas de cookies analytics ni publicitaires
          </strong>{" "}
          de son propre chef. La bannière de consentement est en place pour
          enregistrer vos choix et permettre d&apos;activer ces catégories plus
          tard sans recharger de traceurs avant accord.
        </p>
      </LegalSection>

      <LegalSection title="4. Affiliation (sites tiers)">
        <p>
          Lors d&apos;un clic vers un marchand, le réseau d&apos;affiliation
          (ex. Awin) et/ou le marchand peuvent déposer leurs propres cookies
          pour attribuer une commission. Ces dépôts relèvent de leurs sites /
          politiques, hors du bandeau AmiFidele.
        </p>
      </LegalSection>

      <LegalSection title="5. Gérer vos choix">
        <p className="mb-4">
          Vous pouvez modifier vos préférences à tout moment :
        </p>
        <CookieSettingsButton className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors" />
        <ul className="list-disc pl-5 space-y-1 mt-4">
          <li>
            via le bouton ci-dessus ou le lien « Gérer mes cookies » du pied de
            page ;
          </li>
          <li>
            en paramétrant votre navigateur pour refuser ou supprimer les
            cookies / le stockage local.
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

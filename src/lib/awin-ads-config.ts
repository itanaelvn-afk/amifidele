/**
 * Bannières Awin semi-auto (US pubs display).
 *
 * Remplir `AWIN_AD_CREATIVES` depuis Publisher → Toolbox → My Creative → Copy code :
 * - clickUrl = href du <a> (cread.php / awclick.php…)
 * - imageUrl = src du <img> (souvent cshow.php — compte les impressions)
 *
 * Kill switch : NEXT_PUBLIC_AWIN_ADS_ENABLED=false (défaut : activé si ≥1 créa active).
 */

export type AwinAdCreative = {
  id: string;
  /** Ex. Maxi Zoo */
  advertiser: string;
  imageUrl: string;
  clickUrl: string;
  width: number;
  height: number;
  alt: string;
  /** false = exclu de la rotation */
  active?: boolean;
};

export type AwinAdSlotId = "listing-bottom" | "pdp-below";

export type AwinAdSlotConfig = {
  id: AwinAdSlotId;
  enabled: boolean;
  /** IDs dans `AWIN_AD_CREATIVES`, ordre = priorité de rotation */
  creativeIds: string[];
  /** Libellé accessibilité / légende discrète */
  label?: string;
};

/**
 * Créas My Creative (300×250). Publisher id r=2627370.
 * creativeIds vides sur un slot = toutes les créas actives (rotation journalière).
 */
export const AWIN_AD_CREATIVES: AwinAdCreative[] = [
  {
    id: "maxizoo-300x250-3516855",
    advertiser: "Maxi Zoo FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3516855&v=68698&q=478027&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3516855&v=68698&q=478027&r=2627370",
    width: 300,
    height: 250,
    alt: "Offre Maxi Zoo",
  },
  {
    id: "maxizoo-300x250-3516980",
    advertiser: "Maxi Zoo FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3516980&v=68698&q=478133&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3516980&v=68698&q=478133&r=2627370",
    width: 300,
    height: 250,
    alt: "Offre Maxi Zoo",
  },
  {
    id: "maxizoo-728x90-3517019",
    advertiser: "Maxi Zoo FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3517019&v=68698&q=478136&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3517019&v=68698&q=478136&r=2627370",
    width: 728,
    height: 90,
    alt: "Offre Maxi Zoo",
  },
  {
    id: "maxizoo-728x90-3516972",
    advertiser: "Maxi Zoo FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3516972&v=68698&q=478027&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3516972&v=68698&q=478027&r=2627370",
    width: 728,
    height: 90,
    alt: "Offre Maxi Zoo",
  },
  {
    id: "maxizoo-728x90-3516984",
    advertiser: "Maxi Zoo FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3516984&v=68698&q=478133&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3516984&v=68698&q=478133&r=2627370",
    width: 728,
    height: 90,
    alt: "Offre Maxi Zoo",
  },
  {
    id: "maxizoo-728x90-3516995",
    advertiser: "Maxi Zoo FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3516995&v=68698&q=478134&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3516995&v=68698&q=478134&r=2627370",
    width: 728,
    height: 90,
    alt: "Offre Maxi Zoo",
  },
  {
    id: "vivara-300x250-3870399",
    advertiser: "Vivara FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3870399&v=111580&q=513015&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3870399&v=111580&q=513015&r=2627370",
    width: 300,
    height: 250,
    alt: "Offre Vivara",
  },
  {
    id: "vivara-300x250-3856814",
    advertiser: "Vivara FR",
    imageUrl:
      "https://www.awin1.com/cshow.php?s=3856814&v=111580&q=511470&r=2627370",
    clickUrl:
      "https://www.awin1.com/cread.php?s=3856814&v=111580&q=511470&r=2627370",
    width: 300,
    height: 250,
    alt: "Offre Vivara",
  },
];

export const AWIN_AD_SLOTS: AwinAdSlotConfig[] = [
  {
    id: "listing-bottom",
    enabled: true,
    creativeIds: [
      "maxizoo-728x90-3517019",
      "maxizoo-728x90-3516972",
      "maxizoo-728x90-3516984",
      "maxizoo-728x90-3516995",
    ],
    label: "Offre partenaire",
  },
  {
    id: "pdp-below",
    enabled: true,
    creativeIds: [
      "maxizoo-300x250-3516855",
      "maxizoo-300x250-3516980",
      "vivara-300x250-3870399",
      "vivara-300x250-3856814",
    ],
    label: "Offre partenaire",
  },
];

export function isAwinAdsGloballyEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_AWIN_ADS_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  if (flag === "true" || flag === "1" || flag === "on") return true;
  return AWIN_AD_CREATIVES.some((c) => c.active !== false);
}

export function getAwinAdSlot(slotId: AwinAdSlotId): AwinAdSlotConfig | undefined {
  return AWIN_AD_SLOTS.find((s) => s.id === slotId);
}

export function resolveAwinAdCreative(
  slotId: AwinAdSlotId
): AwinAdCreative | null {
  if (!isAwinAdsGloballyEnabled()) return null;
  const slot = getAwinAdSlot(slotId);
  if (!slot?.enabled || (!slot.creativeIds.length && AWIN_AD_CREATIVES.length === 0)) {
    return null;
  }

  const ids =
    slot.creativeIds.length > 0
      ? slot.creativeIds
      : AWIN_AD_CREATIVES.filter((c) => c.active !== false).map((c) => c.id);

  const active = ids
    .map((id) => AWIN_AD_CREATIVES.find((c) => c.id === id && c.active !== false))
    .filter((c): c is AwinAdCreative => Boolean(c));

  if (active.length === 0) return null;

  // Rotation stable par jour (évite le flicker SSR/client)
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return active[dayIndex % active.length] ?? active[0];
}

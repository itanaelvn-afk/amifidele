/**
 * Découpe une description feed (souvent un pavé sans sauts de ligne)
 * en blocs affichables : paragraphes, titres de section, listes.
 */

export type DescriptionBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

const SECTION_HEADINGS = [
  "Avantages en bref",
  "Aperçu des avantages",
  "Les avantages",
  "Avantages",
  "Caractéristiques principales",
  "Caractéristiques",
  "Composition analytique",
  "Composition",
  "Ingrédients",
  "Mode d'emploi",
  "Mode d’emploi",
  "Recommandation d'utilisation",
  "Recommandation d’utilisation",
  "Conseil d'utilisation",
  "Conseil d’utilisation",
  "Conseils d'utilisation",
  "Conseils d’utilisation",
  "Conseil",
  "Particularités",
  "Informations produit",
  "Informations",
  // Pas de titre seul « Utilisation » : trop fréquent en milieu de phrase
  // (« Son Utilisation est… », « Recommandation d'Utilisation : … »).
  "Contenu de la livraison",
  "Contenu",
  "Matériaux",
  "Matériau",
  "Dimensions",
  "Description du produit",
] as const;

const BULLET_LINE = /^(?:[-–—*•●▪▸►]\s+|\d+[.)]\s+)/;
const INLINE_BULLET_SPLIT = /\s*[•●▪]\s+|\s+[-–—]\s+(?=[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇ0-9])/;

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'");
}

/** HTML feed → texte en conservant les sauts de ligne utiles. */
export function descriptionToPlainText(raw: string): string {
  let text = decodeBasicEntities(raw);
  text = text
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/\s*p\s*>/gi, "\n")
    .replace(/<\s*\/\s*div\s*>/gi, "\n")
    .replace(/<\s*\/\s*li\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "\n• ")
    .replace(/<\s*\/\s*h[1-6]\s*>/gi, "\n")
    .replace(/<\s*h[1-6][^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  text = text.replace(/\r\n?/g, "\n");
  // "d'enfant.Une" → "d'enfant. Une" (ponctuation collée fréquente dans les feeds)
  text = text.replace(/([.!?…])([A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ])/g, "$1 $2");
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t\f\v]+/g, " ").trim())
    .join("\n");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Alternance insensible à la casse sans flag `i` (qui casserait les lookaheads [A-Z]). */
function caseInsensitiveAlternation(headings: readonly string[]): string {
  return [...headings]
    .sort((a, b) => b.length - a.length)
    .map((heading) =>
      escapeRegExp(heading)
        .split("")
        .map((ch) => {
          const lower = ch.toLowerCase();
          const upper = ch.toUpperCase();
          return lower !== upper ? `[${lower}${upper}]` : ch;
        })
        .join("")
    )
    .join("|");
}

/**
 * Déterminants en mot entier uniquement.
 * Sans frontière : « courantes » finissait par `tes` et bloquait
 * « Recommandation d'utilisation ».
 */
const DETERMINANT_LOOKBEHIND =
  "(?<!(?<![\\wÀ-ÿ])(?:[Dd]es|[Ll]es|[Dd]u|[Aa]ux|[Uu]ne|[Uu]n|[Ll]e|[Ll]a|[Mm]on|[Tt]on|[Ss]on|[Mm]es|[Tt]es|[Ss]es)\\s+)";

/** Insère des sauts avant les titres de section connus (texte collé MaxiZoo). */
function insertSectionBreaks(text: string): string {
  const alternation = caseInsensitiveAlternation(SECTION_HEADINGS);
  // Après le titre : « : », puce, majuscule (nouvelle phrase) ou fin —
  // pas une suite en minuscules (« Son Utilisation est un jeu… »).
  // Pas de flag `i` : sinon [A-Z] matcherait aussi « est ».
  const pattern = new RegExp(
    // Pas après une lettre, une apostrophe (« d'… ») ni un déterminant
    // en mot entier (« Aperçu des Avantages », « les Avantages »).
    `(?<![\\wÀ-ÿ'’])${DETERMINANT_LOOKBEHIND}(${alternation})(?=\\s*[:：]|\\s*[•●▪\\-–—*]|\\s+[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]|\\s*$)`,
    "g"
  );
  return text
    .replace(pattern, "\n\n$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeApostrophes(value: string): string {
  return value.replace(/[’‘‛‵′]/g, "'");
}

function findHeadingMatch(candidate: string): string | null {
  const needle = normalizeApostrophes(candidate).toLowerCase();
  const match = [...SECTION_HEADINGS]
    .sort((a, b) => b.length - a.length)
    .find((h) => normalizeApostrophes(h).toLowerCase() === needle);
  return match ?? null;
}

function isHeadingLine(line: string): string | null {
  return findHeadingMatch(line.replace(/[:：]\s*$/, "").trim());
}

/**
 * « Recommandation d’utilisation : Remplissez… » sur une même ligne
 * (fréquente quand le HTML a déjà des &lt;br&gt; ailleurs).
 */
function splitLeadingHeading(
  line: string
): { heading: string; rest: string } | null {
  const sorted = [...SECTION_HEADINGS].sort((a, b) => b.length - a.length);
  for (const heading of sorted) {
    const escaped = escapeRegExp(normalizeApostrophes(heading)).replace(
      /'/g,
      "['’]"
    );
    const pattern = new RegExp(
      `^(${escaped})(?:\\s*[:：]\\s*|\\s+)([\\s\\S]+)$`,
      "i"
    );
    const m = normalizeApostrophes(line).match(pattern);
    if (!m) continue;
    const rest = m[2].trim();
    if (!rest) continue;
    // Évite « Conseil » + « d'utilisation… » (préfixe trop court)
    if (/^(?:d['’]|de |des |du |le |la |les |un |une )/i.test(rest)) continue;
    return { heading, rest };
  }
  return null;
}

function stripBulletPrefix(line: string): string {
  return line.replace(BULLET_LINE, "").trim();
}

function splitInlineList(text: string): string[] | null {
  const parts = text
    .split(INLINE_BULLET_SPLIT)
    .map((p) => p.replace(/^[-–—*•●▪▸►]\s+/, "").trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  // Évite de découper une phrase normale : au moins 2 items « courts »
  const shortish = parts.filter((p) => p.length <= 120).length;
  if (shortish < 2) return null;
  return parts;
}

function splitLongParagraph(text: string): string[] {
  if (text.length < 320) return [text];
  const sentences = text.match(/[^.!?…]+[.!?…]+(?:\s+|$)|[^.!?…]+$/g);
  if (!sentences || sentences.length < 2) return [text];

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const next = `${current}${sentence}`.trim();
    if (current && next.length > 220) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = next;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

function pushParagraph(blocks: DescriptionBlock[], text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  const inlineList = splitInlineList(trimmed);
  if (inlineList) {
    blocks.push({ type: "list", items: inlineList });
    return;
  }
  for (const chunk of splitLongParagraph(trimmed)) {
    blocks.push({ type: "paragraph", text: chunk });
  }
}

/**
 * Répare les coupures du type « Recommandation d' » + titre + « : suite… »
 * (apostrophe élidée avant un faux titre).
 */
function repairElidedHeadingFragments(
  blocks: DescriptionBlock[]
): DescriptionBlock[] {
  const result: DescriptionBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const prev = result[result.length - 1];
    const cur = blocks[i];
    const next = blocks[i + 1];

    const prevElision =
      prev?.type === "paragraph" && /[dl]['’]\s*$/i.test(prev.text);

    if (
      prevElision &&
      cur.type === "heading" &&
      next?.type === "paragraph" &&
      /^\s*[:：]/.test(next.text)
    ) {
      const merged = `${prev.text}${cur.text}${next.text.replace(/^\s*/, " ")}`
        .replace(/\s+/g, " ")
        .replace(/\s+([:：])/g, "$1")
        .trim();
      result[result.length - 1] = { type: "paragraph", text: merged };
      i += 1;
      continue;
    }

    result.push(cur);
  }
  return result;
}

/**
 * Transforme une description brute en blocs structurés pour la PDP.
 */
export function parseProductDescription(raw: string): DescriptionBlock[] {
  if (!raw?.trim()) return [];

  let text = descriptionToPlainText(raw);
  if (!text) return [];

  // Toujours injecter les titres connus (même si le HTML a déjà des <br>)
  text = insertSectionBreaks(text);

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const blocks: DescriptionBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push({ type: "list", items: listBuffer });
    listBuffer = [];
  };

  for (const line of lines) {
    const heading = isHeadingLine(line);
    if (heading) {
      flushList();
      blocks.push({ type: "heading", text: heading });
      continue;
    }

    const leading = splitLeadingHeading(line);
    if (leading) {
      flushList();
      blocks.push({
        type: "heading",
        text: headingWithColon(leading.heading),
      });
      if (BULLET_LINE.test(leading.rest)) {
        const item = stripBulletPrefix(leading.rest);
        const inline = splitInlineList(item);
        if (inline) blocks.push({ type: "list", items: inline });
        else listBuffer.push(item);
      } else {
        pushParagraph(blocks, leading.rest);
      }
      continue;
    }

    if (BULLET_LINE.test(line)) {
      const item = stripBulletPrefix(line);
      const inline = splitInlineList(item);
      if (inline) {
        flushList();
        blocks.push({ type: "list", items: inline });
      } else {
        listBuffer.push(item);
      }
      continue;
    }

    flushList();
    pushParagraph(blocks, line);
  }
  flushList();

  return attachColonsToHeadings(repairElidedHeadingFragments(blocks));
}

function headingWithColon(text: string): string {
  return /[:：]\s*$/.test(text) ? text.trim() : `${text.trim()} :`;
}

/**
 * « Titre » puis « : suite » → le « : » rejoint le titre
 * (« Recommandation d'utilisation : », « Les avantages : »)
 * au lieu d’être perdu ou orphelin (y compris avant une liste).
 */
function attachColonsToHeadings(
  blocks: DescriptionBlock[]
): DescriptionBlock[] {
  const result: DescriptionBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    if (block.type === "heading" && next?.type === "paragraph") {
      if (/^\s*[:：]\s*/.test(next.text)) {
        const rest = next.text.replace(/^\s*[:：]\s*/, "").trim();
        result.push({ type: "heading", text: headingWithColon(block.text) });
        if (rest) result.push({ type: "paragraph", text: rest });
        i += 1;
        continue;
      }
    }
    if (block.type === "heading" && next?.type === "list" && next.items.length > 0) {
      const first = next.items[0] ?? "";
      if (/^[:：]\s*$/.test(first)) {
        result.push({ type: "heading", text: headingWithColon(block.text) });
        result.push({ type: "list", items: next.items.slice(1) });
        i += 1;
        continue;
      }
      if (/^[:：]\s+/.test(first)) {
        result.push({ type: "heading", text: headingWithColon(block.text) });
        result.push({
          type: "list",
          items: [first.replace(/^[:：]\s+/, "").trim(), ...next.items.slice(1)],
        });
        i += 1;
        continue;
      }
    }
    result.push(block);
  }
  return result;
}

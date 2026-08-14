/**
 * HTML whitelist descriptions éditées Dashboard (défense en profondeur).
 * Doit rester aligné avec api-amifidele/src/utils/sanitizeDescriptionHtml.js
 */

const ALLOWED_TAGS = new Set(["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "br"]);
const TAG_ALIASES: Record<string, string> = {
  b: "strong",
  i: "em",
  div: "p",
};

export function sanitizeDescriptionHtml(input: string): string {
  let html = String(input || "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
  html = html.replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "");
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (full, tag: string) => {
    const closing = full.startsWith("</");
    const mapped = TAG_ALIASES[tag.toLowerCase()] || tag.toLowerCase();
    if (!ALLOWED_TAGS.has(mapped)) return "";
    if (mapped === "br") return closing ? "" : "<br>";
    return closing ? `</${mapped}>` : `<${mapped}>`;
  });
  return html.trim();
}

/**
 * Audit layout mobile/desktop — débordement horizontal + taille CTA.
 * Usage: node scripts/audit-responsive.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE_URL || "https://amifidele.fr";
const PAGES = ["/", "/produits", "/contact", "/a-propos", "/marques"];
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 800 },
];

async function acceptCookies(page) {
  const btn = page.getByRole("button", { name: /Tout accepter|Tout refuser/i }).first();
  try {
    await btn.waitFor({ timeout: 4000 });
    await btn.click();
  } catch {
    /* pas de bannière */
  }
}

async function checkPage(page, path, viewport) {
  const url = `${BASE}${path}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await acceptCookies(page);
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = doc.clientWidth;
    const overflow = scrollWidth - clientWidth;

    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > clientWidth + 1 || r.left < -1) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className && String(el.className).slice?.(0, 80)) || "";
        offenders.push({
          tag,
          cls,
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
        if (offenders.length >= 8) break;
      }
    }

    const ctas = [];
    for (const el of document.querySelectorAll("a, button")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 36 || r.width < 36) {
        const text = (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40);
        ctas.push({
          text,
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
        if (ctas.length >= 12) break;
      }
    }

    return { scrollWidth, clientWidth, overflow, offenders, smallCtas: ctas };
  });

  return { path, viewport: viewport.name, ...metrics };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: "fr-FR",
    });
    const page = await context.newPage();
    for (const path of PAGES) {
      try {
        results.push(await checkPage(page, path, vp));
      } catch (err) {
        results.push({
          path,
          viewport: vp.name,
          error: String(err.message || err),
        });
      }
    }
    await context.close();
  }

  await browser.close();

  const issues = results.filter(
    (r) => r.error || (r.overflow != null && r.overflow > 2) || (r.smallCtas && r.smallCtas.length)
  );

  console.log(JSON.stringify({ base: BASE, results, issueCount: issues.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

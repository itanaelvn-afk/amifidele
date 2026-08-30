/**
 * Audit Google Analytics 4 + consentement (prod).
 * Usage: node scripts/audit-ga.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE_URL || "https://amifidele.fr";
const CONSENT_KEY = "amifidele-consent-v1";

function summarizeRequests(urls) {
  const ga = urls.filter(
    (u) =>
      u.includes("googletagmanager.com") ||
      u.includes("google-analytics.com") ||
      u.includes("/g/collect") ||
      u.includes("analytics.google.com")
  );
  const ids = new Set();
  for (const u of ga) {
    const m = u.match(/[?&]id=(G-[A-Z0-9]+)/i) || u.match(/\/g\/collect\?.*tid=(G-[A-Z0-9]+)/i);
    if (m) ids.add(m[1].toUpperCase());
  }
  return { count: ga.length, sample: ga.slice(0, 8), measurementIds: [...ids] };
}

async function collect(scenario) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: "fr-FR",
  });
  const page = await context.newPage();
  const urls = [];
  page.on("request", (req) => {
    const u = req.url();
    if (
      u.includes("google") ||
      u.includes("gtag") ||
      u.includes("analytics") ||
      u.includes("/g/collect")
    ) {
      urls.push(u);
    }
  });

  if (scenario.preConsent) {
    await context.addInitScript(
      ({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      { key: CONSENT_KEY, value: scenario.preConsent }
    );
  }

  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);

  if (scenario.click) {
    const btn = page.getByRole("button", { name: scenario.click });
    await btn.click();
    await page.waitForTimeout(2500);
  }

  if (scenario.navigateTo) {
    await page.goto(`${BASE}${scenario.navigateTo}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(2000);
  }

  const dom = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll("script[src]")].map((s) =>
      s.getAttribute("src")
    );
    const inlineGa = [...document.querySelectorAll("script")].some((s) =>
      (s.textContent || "").includes("gtag(")
    );
    const hasGtag = typeof window.gtag === "function";
    const hasDataLayer = Array.isArray(window.dataLayer);
    const consentRaw = localStorage.getItem("amifidele-consent-v1");
    return {
      gtmScripts: scripts.filter((s) => s && s.includes("googletagmanager")),
      inlineGa,
      hasGtag,
      hasDataLayer,
      dataLayerLen: hasDataLayer ? window.dataLayer.length : 0,
      consentRaw,
    };
  });

  await browser.close();
  return {
    scenario: scenario.name,
    requests: summarizeRequests(urls),
    dom,
  };
}

async function main() {
  const results = [];

  results.push(
    await collect({
      name: "fresh_no_decision",
      // bannière visible, pas d'acceptation
    })
  );

  results.push(
    await collect({
      name: "click_refuse_all",
      click: /Tout refuser/i,
    })
  );

  results.push(
    await collect({
      name: "click_accept_all",
      click: /Tout accepter/i,
      navigateTo: "/produits",
    })
  );

  results.push(
    await collect({
      name: "stored_analytics_true",
      preConsent: {
        version: 1,
        necessary: true,
        analytics: true,
        marketing: false,
        updatedAt: new Date().toISOString(),
      },
      navigateTo: "/produits",
    })
  );

  results.push(
    await collect({
      name: "stored_analytics_false",
      preConsent: {
        version: 1,
        necessary: true,
        analytics: false,
        marketing: false,
        updatedAt: new Date().toISOString(),
      },
    })
  );

  const report = {
    base: BASE,
    auditedAt: new Date().toISOString(),
    results,
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

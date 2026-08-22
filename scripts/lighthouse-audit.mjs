#!/usr/bin/env node
/**
 * Audit Lighthouse — PageSpeed API ou Chrome local (fallback auto).
 * Les rapports sont écrits dans reports/lighthouse/ (gitignored).
 *
 * Usage :
 *   npm run audit:lighthouse
 *   LH_MODE=local npm run audit:lighthouse
 *   SITE_URL=https://amifidele.fr node scripts/lighthouse-audit.mjs
 */
import { execFile } from "node:child_process";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "reports", "lighthouse");

const SITE = (process.env.SITE_URL || "https://amifidele.fr").replace(/\/+$/, "");
const DATE = new Date().toISOString().slice(0, 10);
const MODE = (process.env.LH_MODE || "auto").toLowerCase();

const TARGETS = [
  { name: "home", path: "/", strategy: "mobile" },
  { name: "home", path: "/", strategy: "desktop" },
  { name: "produits", path: "/produits", strategy: "mobile" },
  { name: "produits", path: "/produits", strategy: "desktop" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const WAIT_BETWEEN_MS = Number(process.env.LH_WAIT_MS || 15000);

function scorePct(value) {
  return value == null ? null : Math.round(value * 100);
}

async function resolveChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const chromeRoot = path.join(ROOT, "chrome");
  try {
    const versions = await readdir(chromeRoot);
    for (const version of versions.sort().reverse()) {
      const candidate = path.join(
        chromeRoot,
        version,
        "chrome-win64",
        "chrome.exe"
      );
      try {
        await readFile(candidate);
        return candidate;
      } catch {
        // try next
      }
    }
  } catch {
    // no local chrome
  }
  return null;
}

async function runPagespeed(url, strategy) {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", strategy);
  for (const category of [
    "PERFORMANCE",
    "ACCESSIBILITY",
    "BEST_PRACTICES",
    "SEO",
  ]) {
    api.searchParams.append("category", category);
  }

  const res = await fetch(api);
  if (!res.ok) {
    throw new Error(`PageSpeed ${res.status} for ${url} (${strategy})`);
  }
  return res.json();
}

async function runLocalLighthouse(url, strategy, chromePath) {
  const tmpPath = path.join(
    os.tmpdir(),
    `amifidele-lh-${Date.now()}-${strategy}.json`
  );
  const formFactorArgs =
    strategy === "desktop"
      ? ["--preset=desktop"]
      : [`--form-factor=${strategy}`];
  const npxArgs = [
    "--yes",
    "lighthouse@12.6.1",
    url,
    `--chrome-path=${chromePath}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${tmpPath}`,
    ...formFactorArgs,
    "--quiet",
    "--no-enable-error-reporting",
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
  ];

  await execFileAsync("npx", npxArgs, {
    cwd: ROOT,
    maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, CHROME_PATH: chromePath },
    shell: true,
  });

  const raw = JSON.parse(await readFile(tmpPath, "utf8"));
  await unlink(tmpPath).catch(() => {});
  return { lighthouseResult: raw, analysisUTCTimestamp: raw.fetchTime };
}

function extractMetrics(lighthouseResult) {
  const audits = lighthouseResult?.audits || {};
  const pick = (id) => {
    const audit = audits[id];
    if (!audit) return null;
    return audit.displayValue || audit.numericValue || null;
  };
  return {
    fcp: pick("first-contentful-paint"),
    lcp: pick("largest-contentful-paint"),
    tbt: pick("total-blocking-time"),
    cls: pick("cumulative-layout-shift"),
    si: pick("speed-index"),
  };
}

function extractIssues(lighthouseResult, limit = 15) {
  const audits = lighthouseResult?.audits || {};
  return Object.entries(audits)
    .map(([id, audit]) => ({ id, ...audit }))
    .filter(
      (audit) =>
        audit.score != null &&
        audit.score < 1 &&
        audit.scoreDisplayMode !== "informative" &&
        audit.scoreDisplayMode !== "manual"
    )
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
    .slice(0, limit)
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      score: scorePct(audit.score),
      description: audit.description?.replace(/\s+/g, " ").trim() || "",
      displayValue: audit.displayValue || null,
    }));
}

function buildEntry(target, payload) {
  const lighthouseResult = payload.lighthouseResult;
  const categories = lighthouseResult.categories;
  const url = `${SITE}${target.path}`;
  const label = `${target.name}-${target.strategy}`;

  return {
    label,
    url,
    strategy: target.strategy,
    source: payload.source,
    fetchedAt: payload.analysisUTCTimestamp || new Date().toISOString(),
    scores: {
      performance: scorePct(categories.performance?.score),
      accessibility: scorePct(categories.accessibility?.score),
      bestPractices: scorePct(categories["best-practices"]?.score),
      seo: scorePct(categories.seo?.score),
    },
    metrics: extractMetrics(lighthouseResult),
    issues: extractIssues(lighthouseResult),
    reportUrl: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&form_factor=${target.strategy}`,
    lighthouseVersion: lighthouseResult.lighthouseVersion || null,
  };
}

function toMarkdown(summary) {
  const lines = [
    `# Audit Lighthouse — ${summary.site}`,
    ``,
    `Date : ${summary.generatedAt}`,
    `Source : ${summary.source}`,
    ``,
    `| Page | Device | Perf | A11y | BP | SEO | LCP | CLS |`,
    `| --- | --- | ---: | ---: | ---: | ---: | --- | --- |`,
  ];

  for (const entry of summary.results) {
    lines.push(
      `| ${entry.label} | ${entry.strategy} | ${entry.scores.performance ?? "n/a"} | ${entry.scores.accessibility ?? "n/a"} | ${entry.scores.bestPractices ?? "n/a"} | ${entry.scores.seo ?? "n/a"} | ${entry.metrics.lcp ?? "n/a"} | ${entry.metrics.cls ?? "n/a"} |`
    );
  }

  for (const entry of summary.results) {
    lines.push(
      "",
      `## ${entry.label}`,
      "",
      `- URL : ${entry.url}`,
      `- Source : ${entry.source}`,
      `- Rapport : ${entry.reportUrl}`,
      ""
    );
    if (entry.issues.length === 0) {
      lines.push("Aucune issue majeure détectée.", "");
      continue;
    }
    lines.push("### Issues", "");
    for (const issue of entry.issues) {
      lines.push(`- **[${issue.score}] ${issue.title}**`);
      if (issue.displayValue) lines.push(`  - Valeur : ${issue.displayValue}`);
      if (issue.description) lines.push(`  - ${issue.description}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function fetchAudit(target, chromePath) {
  const url = `${SITE}${target.path}`;

  if (MODE === "local") {
    if (!chromePath) throw new Error("LH_MODE=local mais Chrome introuvable (npm run chrome:install ?)");
    const payload = await runLocalLighthouse(url, target.strategy, chromePath);
    return { ...payload, source: "lighthouse-local" };
  }

  if (MODE === "api") {
    const payload = await runPagespeed(url, target.strategy);
    return { ...payload, source: "pagespeed-api" };
  }

  // auto : API puis fallback local
  try {
    const payload = await runPagespeed(url, target.strategy);
    return { ...payload, source: "pagespeed-api" };
  } catch (err) {
    if (!chromePath) throw err;
    process.stdout.write(`API indisponible (${err.message}), fallback local… `);
    const payload = await runLocalLighthouse(url, target.strategy, chromePath);
    return { ...payload, source: "lighthouse-local" };
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const chromePath = await resolveChromePath();
  if (MODE === "local" && !chromePath) {
    throw new Error(
      "Chrome local introuvable. Lancez : npx @puppeteer/browsers install chrome@stable"
    );
  }

  const results = [];
  let source = MODE === "local" ? "lighthouse-local" : "pagespeed-api";

  for (const target of TARGETS) {
    const label = `${target.name}-${target.strategy}`;
    process.stdout.write(`Audit ${label}… `);

    let attempt = 0;
    let payload;
    while (attempt < 3) {
      attempt += 1;
      try {
        payload = await fetchAudit(target, chromePath);
        break;
      } catch (err) {
        if (attempt >= 3) throw err;
        const wait = WAIT_BETWEEN_MS * attempt;
        process.stdout.write(`retry ${attempt} (${wait}ms)… `);
        await sleep(wait);
      }
    }

    if (payload.source === "lighthouse-local") source = "lighthouse-local";
    const entry = buildEntry(target, payload);
    results.push(entry);

    const jsonPath = path.join(OUT_DIR, `${DATE}-${label}.json`);
    await writeFile(jsonPath, JSON.stringify({ entry, raw: payload }, null, 2), "utf8");

    console.log(
      `[${entry.source}] perf ${entry.scores.performance} · a11y ${entry.scores.accessibility} · bp ${entry.scores.bestPractices} · seo ${entry.scores.seo}`
    );
    await sleep(WAIT_BETWEEN_MS);
  }

  const summary = {
    site: SITE,
    generatedAt: new Date().toISOString(),
    source,
    results,
  };

  await writeFile(
    path.join(OUT_DIR, `${DATE}-summary.json`),
    JSON.stringify(summary, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(OUT_DIR, "latest-summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(OUT_DIR, "latest-summary.md"),
    toMarkdown(summary),
    "utf8"
  );

  console.log(`\nRapports enregistrés dans ${OUT_DIR}`);
  console.log(`- latest-summary.md`);
  console.log(`- latest-summary.json`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

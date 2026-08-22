#!/usr/bin/env node
/**
 * Contrôle uptime rapide (site + API) — à lancer manuellement ou en cron local.
 * Usage : npm run smoke:uptime
 */
const SITE = process.env.SITE_URL || "https://amifidele.fr";
const API = process.env.API_HEALTH_URL || "https://api.amifidele.fr/health";
const TIMEOUT_MS = Number(process.env.UPTIME_TIMEOUT_MS || 10000);

async function check(label, url) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "amifidele-uptime/1.0" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - started;
    const ok = res.ok;
    console.log(`${ok ? "OK" : "FAIL"} ${label} → ${res.status} ${ms}ms ${url}`);
    return ok;
  } catch (err) {
    const ms = Date.now() - started;
    console.log(`FAIL ${label} → ${ms}ms ${url} (${err.cause?.code || err.message})`);
    return false;
  }
}

async function main() {
  const results = await Promise.all([
    check("site /", `${SITE}/`),
    check("site /produits", `${SITE}/produits`),
    check("api /health", API),
  ]);
  const failed = results.filter((r) => !r).length;
  if (failed) {
    console.error(`\n${failed} check(s) en échec.`);
    process.exit(1);
  }
  console.log("\nUptime OK.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

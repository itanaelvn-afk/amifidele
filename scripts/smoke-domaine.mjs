#!/usr/bin/env node
/**
 * Smoke test post-MEP domaine (à lancer quand DNS + Vercel + API NAS sont up).
 * Usage : node scripts/smoke-domaine.mjs
 */
const SITE = process.env.SITE_URL || "https://amifidele.fr";
const API = process.env.API_HEALTH_URL || "https://api.amifidele.fr/health";

async function check(label, url, opts = {}) {
  try {
    const res = await fetch(url, {
      redirect: opts.followRedirects === false ? "manual" : "follow",
      headers: { "User-Agent": "amifidele-smoke/1.0" },
    });
    let ok = opts.expectStatus
      ? opts.expectStatus.includes(res.status)
      : res.ok;

    if (ok && opts.rejectBodyIncludes?.length) {
      const text = await res.text();
      for (const needle of opts.rejectBodyIncludes) {
        if (text.includes(needle)) {
          ok = false;
          console.log(
            `FAIL ${label} → ${res.status} ${url} (contenu indésirable: ${needle})`
          );
          return false;
        }
      }
    }

    console.log(
      `${ok ? "OK" : "FAIL"} ${label} → ${res.status} ${url}` +
        (res.headers.get("location")
          ? ` (Location: ${res.headers.get("location")})`
          : "")
    );
    return ok;
  } catch (err) {
    const msg = err?.cause?.code || err.message || String(err);
    console.log(`FAIL ${label} → ${url} (${msg})`);
    return false;
  }
}

async function main() {
  const results = [];
  results.push(
    await check("site apex", SITE, {
      rejectBodyIncludes: [
        "Ligne Web Services",
        "lwshosting.name",
        "parking_lws",
      ],
    })
  );
  results.push(
    await check("www redirect", "https://www.amifidele.fr/", {
      followRedirects: false,
      expectStatus: [301, 302, 307, 308],
    })
  );
  results.push(await check("api health", API));

  const failed = results.filter((r) => !r).length;
  if (failed) {
    console.error(
      `\n${failed} check(s) en échec — DNS / Vercel / NAS à finaliser.`
    );
    process.exit(1);
  }
  console.log("\nSmoke domaine OK.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

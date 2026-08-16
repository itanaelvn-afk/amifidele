#!/usr/bin/env node
/**
 * Attend que le DNS LWS pointe vers Vercel (+ api vers la box).
 * Usage : node scripts/wait-dns.mjs
 */
import { resolve4 } from "node:dns/promises";

const VERCEL_A = "76.76.21.21";
const API_A = process.env.API_A_IP || "176.168.243.35";

const hosts = [
  { name: "amifidele.fr", expect: VERCEL_A },
  { name: "www.amifidele.fr", expect: VERCEL_A },
  { name: "api.amifidele.fr", expect: API_A },
];

async function checkHost({ name, expect }) {
  try {
    const addrs = await resolve4(name);
    const ok = addrs.includes(expect);
    console.log(
      `${ok ? "OK" : "WAIT"} ${name} → ${addrs.join(", ") || "(vide)"} (attendu ${expect})`
    );
    return ok;
  } catch (err) {
    console.log(`WAIT ${name} → ${err.code || err.message}`);
    return false;
  }
}

async function main() {
  const intervalMs = Number(process.env.DNS_POLL_MS || 15000);
  const maxMs = Number(process.env.DNS_POLL_MAX_MS || 15 * 60 * 1000);
  const started = Date.now();

  console.log(
    "Chez LWS (zone amifidele.fr), poser / remplacer :\n" +
      `  A  @    ${VERCEL_A}\n` +
      `  A  www  ${VERCEL_A}\n` +
      `  A  api  ${API_A}\n` +
      "Supprimer l’ancien A/@ vers le parking LWS et tout CNAME www → apex.\n"
  );

  while (Date.now() - started < maxMs) {
    const results = await Promise.all(hosts.map(checkHost));
    if (results.every(Boolean)) {
      console.log("\nDNS @ / www / api OK.");
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  console.error("Timeout — DNS pas encore propagé.");
  process.exit(1);
}

main();

#!/usr/bin/env node
/**
 * Crée un monitor UptimeRobot via le flux agentic (sans API key).
 * L'owner doit confirmer par e-mail.
 *
 * Usage :
 *   node scripts/setup-uptime-monitor.mjs https://amifidele.fr/ contact@amifidele.fr
 */
import { createHash } from "node:crypto";

const API = "https://api.uptimerobot.com";
const url = process.argv[2];
const email = process.argv[3] || "contact@amifidele.fr";

if (!url) {
  console.error(
    "Usage: node scripts/setup-uptime-monitor.mjs <url> [email]"
  );
  process.exit(1);
}

function leadingZeroBits(buf) {
  let zeros = 0;
  for (const byte of buf) {
    if (byte === 0) {
      zeros += 8;
    } else {
      zeros += 8 - Math.floor(Math.log2(byte)) - 1;
      break;
    }
  }
  return zeros;
}

function solvePow(nonce, difficulty) {
  let counter = 0;
  while (true) {
    const hash = createHash("sha256").update(`${nonce}|${counter}`).digest();
    if (leadingZeroBits(hash) >= difficulty) return counter;
    counter += 1;
  }
}

async function main() {
  const challengeUrl = new URL(`${API}/agentic/agent-monitor/challenge`);
  challengeUrl.searchParams.set("email", email);
  challengeUrl.searchParams.set("url", url);

  const challengeRes = await fetch(challengeUrl);
  if (!challengeRes.ok) {
    throw new Error(`Challenge failed: ${challengeRes.status}`);
  }
  const challenge = await challengeRes.json();
  const { nonce, timestamp, difficulty, signature } = challenge;
  if (!nonce || difficulty == null) {
    throw new Error(`Challenge invalide: ${JSON.stringify(challenge)}`);
  }

  process.stdout.write(
    `PoW difficulty=${difficulty} for ${url}… `
  );
  const counter = solvePow(nonce, difficulty);
  console.log(`ok (counter=${counter})`);

  const submitRes = await fetch(`${API}/agentic/agent-monitor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      url,
      nonce,
      timestamp,
      counter,
      signature,
    }),
  });

  const body = await submitRes.json().catch(() => ({}));
  if (submitRes.status === 400) {
    throw new Error(`INVALID_PROOF_OF_WORK: ${JSON.stringify(body)}`);
  }
  if (!submitRes.ok) {
    throw new Error(`Submit failed ${submitRes.status}: ${JSON.stringify(body)}`);
  }

  console.log(JSON.stringify(body, null, 2));
  console.log(
    `\n→ Vérifie la boîte ${email} et clique le lien UptimeRobot pour activer le monitor.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

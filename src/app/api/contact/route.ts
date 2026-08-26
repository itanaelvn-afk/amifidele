/**
 * Route API du formulaire de contact (`POST /api/contact`).
 *
 * Flux :
 * 1. Le navigateur envoie nom / e-mail / topic / message depuis `ContactForm`
 *    (page `/contact`) vers cette route — jamais directement vers Formspree
 *    (l’ID reste côté serveur).
 * 2. Validation + honeypot `company` (si rempli → faux succès, pas d’envoi).
 * 3. Si `FORMSPREE_FORM_ID` est défini : POST JSON vers
 *    `https://formspree.io/f/<id>` ; Formspree notifie l’e-mail du compte
 *    et stocke la soumission dans son dashboard (sujet préfixé par type).
 * 4. Sans ID : en développement l’envoi est simulé (log console) ;
 *    en production → 503 avec fallback mailto.
 *
 * Config : `.env.local` → `FORMSPREE_FORM_ID=xxxxxxxx`
 * (voir `.env.example`). Ne pas committer l’ID.
 */
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

const ALLOWED_TOPICS = new Set([
  "question",
  "bug",
  "idee",
  "ux",
  "autre",
]);

const TOPIC_LABELS: Record<string, string> = {
  question: "Question",
  bug: "Bug / problème",
  idee: "Idée / suggestion",
  ux: "Expérience du site (UX)",
  autre: "Autre",
};

type ContactBody = {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  message?: unknown;
  /** Honeypot — doit rester vide (bots) */
  company?: unknown;
};

function parseTopic(value: unknown): string {
  if (typeof value === "string" && ALLOWED_TOPICS.has(value)) return value;
  return "question";
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  // Bot : honeypot rempli → faux succès, pas d’envoi
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(body.name, MAX_NAME);
  const email = asTrimmedString(body.email, MAX_EMAIL);
  const message = asTrimmedString(body.message, MAX_MESSAGE);
  const topic = parseTopic(body.topic);
  const topicLabel = TOPIC_LABELS[topic] ?? TOPIC_LABELS.question;

  if (!name) {
    return NextResponse.json(
      { message: "Indiquez votre nom (120 caractères max)." },
      { status: 400 }
    );
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { message: "Indiquez une adresse e-mail valide." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json(
      { message: "Le message ne peut pas être vide." },
      { status: 400 }
    );
  }

  const formId = process.env.FORMSPREE_FORM_ID?.trim();

  if (!formId) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] FORMSPREE_FORM_ID absent — message simulé:", {
        name,
        email,
        topic,
        messageLength: message.length,
      });
      return NextResponse.json({
        ok: true,
        simulated: true,
      });
    }
    return NextResponse.json(
      {
        message:
          "Le formulaire de contact n’est pas encore configuré. Écrivez-nous à contact@amifidele.fr.",
      },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        topic,
        topicLabel,
        message,
        _replyto: email,
        _subject: `AmiFidele [${topicLabel}] — ${name}`,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("[contact] Formspree error", upstream.status, detail);
      return NextResponse.json(
        { message: "Échec de l’envoi. Réessayez plus tard ou utilisez contact@amifidele.fr." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Envoi impossible", error);
    return NextResponse.json(
      { message: "Échec de l’envoi. Réessayez plus tard ou utilisez contact@amifidele.fr." },
      { status: 502 }
    );
  }
}

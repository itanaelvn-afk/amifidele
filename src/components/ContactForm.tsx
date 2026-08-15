"use client";

/**
 * Formulaire `/contact`.
 * Envoie les données à `POST /api/contact` (proxy serveur → Formspree).
 * Ne pas appeler Formspree depuis le navigateur : garder `FORMSPREE_FORM_ID` secret.
 */

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  function validate(): boolean {
    const next: typeof fieldErrors = {};
    if (!name.trim()) next.name = "Le nom est requis.";
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      next.email = "Indiquez une adresse e-mail valide.";
    }
    if (!message.trim()) next.message = "Le message est requis.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        ok?: boolean;
      };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.message ||
            "Impossible d’envoyer le message. Réessayez ou écrivez à contact@amifidele.fr."
        );
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setCompany("");
      setFieldErrors({});
    } catch {
      setStatus("error");
      setErrorMessage(
        "Impossible d’envoyer le message. Réessayez ou écrivez à contact@amifidele.fr."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-lg border border-primary/30 bg-primary/5 p-6"
        role="status"
      >
        <p className="font-semibold text-foreground mb-2">Message envoyé</p>
        <p className="text-sm text-muted-foreground mb-4">
          Merci. Nous vous répondrons dès que possible à l&apos;adresse indiquée.
        </p>
        <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot anti-spam — caché des utilisateurs */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Société</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Nom
        </label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="contact-name-error" className="text-sm text-destructive">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="contact-email-error" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={5000}
          className="flex min-h-[9rem] w-full rounded-md border border-input bg-input-background px-3 py-2 text-base text-foreground md:text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="contact-message-error" className="text-sm text-destructive">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        En envoyant ce formulaire, vous acceptez que vos données (nom, e-mail,
        message) soient utilisées pour traiter votre demande. Voir la{" "}
        <a href="/confidentialite" className="underline hover:text-primary">
          politique de confidentialité
        </a>
        .
      </p>

      {status === "error" && errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}

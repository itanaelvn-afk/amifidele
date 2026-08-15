import { SiteChrome } from "@/components/SiteChrome";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact | AmiFidele",
  description:
    "Contactez AmiFidele pour une question sur le comparateur ou signaler un problème.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <SiteChrome current="contact">
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-3">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Une question, une suggestion ou un problème sur le catalogue ? Écrivez-nous
          via le formulaire ci-dessous, ou par e-mail à{" "}
          <a
            href="mailto:contact@amifidele.fr"
            className="text-primary hover:underline"
          >
            contact@amifidele.fr
          </a>
          .
        </p>
        <ContactForm />
      </main>
    </SiteChrome>
  );
}

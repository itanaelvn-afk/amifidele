import { SiteChrome } from "@/components/SiteChrome";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact | AmiFidele",
  description:
    "Contactez AmiFidele pour une question, un bug, une idée ou un retour sur le comparateur.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ sujet?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { sujet } = await searchParams;

  return (
    <SiteChrome current="contact">
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-3">Contact &amp; avis</h1>
        <p className="text-muted-foreground mb-8">
          Une question, un bug, une idée d&apos;amélioration ou un retour sur
          l&apos;expérience du site ? Écrivez-nous via le formulaire, ou par
          e-mail à{" "}
          <a
            href="mailto:contact@amifidele.fr"
            className="text-primary hover:underline"
          >
            contact@amifidele.fr
          </a>
          . Indiquez le type de retour pour nous aider à prioriser.
        </p>
        <ContactForm initialTopic={sujet} />
      </main>
    </SiteChrome>
  );
}

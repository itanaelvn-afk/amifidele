import Link from "next/link";
import { Button } from "@/components/ui/button";

type Action = {
  href?: string;
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
};

/**
 * Mise en page commune pour 404 / erreurs runtime.
 */
export function ErrorState({
  code,
  title,
  description,
  actions,
}: {
  code?: string;
  title: string;
  description: string;
  actions: Action[];
}) {
  return (
    <main className="container mx-auto px-4 py-20 max-w-lg text-center">
      {code ? (
        <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide">
          {code}
        </p>
      ) : null}
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actions.map((action) =>
          action.href ? (
            <Button
              key={action.label}
              asChild
              variant={action.variant ?? "default"}
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button
              key={action.label}
              type="button"
              variant={action.variant ?? "default"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        )}
      </div>
    </main>
  );
}

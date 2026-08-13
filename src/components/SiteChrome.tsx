import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header, type HeaderCurrent } from "@/components/Header";

/**
 * En-tête + pied partagés (liens réels Accueil / Produits).
 */
export function SiteChrome({
  children,
  current = "other",
}: {
  children: ReactNode;
  current?: HeaderCurrent;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header current={current} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

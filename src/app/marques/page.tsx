import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchBrands, type Brand } from "@/lib/api";
import { productsByBrandHref } from "@/lib/brand-path";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Marques | AmiFidele",
  description:
    "Parcourez les marques du catalogue AmiFidele et filtrez les produits par marque.",
  path: "/marques",
});

export const revalidate = 3600;

function brandKey(brand: Brand): string {
  return String(brand._id || brand.id || brand.name);
}

function groupBrandsByLetter(brands: Brand[]): Map<string, Brand[]> {
  const groups = new Map<string, Brand[]>();
  for (const brand of brands) {
    const name = (brand.name || brand.brandName || "").trim();
    if (!name) continue;
    const letter = name.charAt(0).toLocaleUpperCase("fr-FR");
    const key =
      letter
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .charAt(0)
        .toUpperCase() || "#";
    const bucket = /[A-Z]/.test(key) ? key : "#";
    const list = groups.get(bucket) || [];
    list.push(brand);
    groups.set(bucket, list);
  }
  return new Map(
    [...groups.entries()].sort(([a], [b]) =>
      a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b, "fr")
    )
  );
}

export default async function MarquesPage() {
  let brands: Brand[] = [];
  let loadError = false;
  try {
    brands = await fetchBrands();
  } catch {
    loadError = true;
  }

  const grouped = groupBrandsByLetter(brands);

  return (
    <SiteChrome current="marques">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Marques</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Retrouvez les marques présentes dans le catalogue AmiFidele. Cliquez
          sur une marque pour voir ses produits visibles.
        </p>

        {loadError ? (
          <p className="text-destructive" role="alert">
            Impossible de charger les marques pour le moment. Réessayez plus
            tard ou parcourez le{" "}
            <Link href="/produits" className="underline hover:text-primary">
              catalogue
            </Link>
            .
          </p>
        ) : brands.length === 0 ? (
          <p className="text-muted-foreground">
            Aucune marque n&apos;est encore disponible. Consultez le{" "}
            <Link href="/produits" className="text-primary hover:underline">
              catalogue produits
            </Link>
            .
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">
              <span className="font-semibold text-foreground">{brands.length}</span>{" "}
              marque{brands.length > 1 ? "s" : ""}
            </p>
            <div className="space-y-10">
              {[...grouped.entries()].map(([letter, list]) => (
                <section key={letter} aria-labelledby={`brand-letter-${letter}`}>
                  <h2
                    id={`brand-letter-${letter}`}
                    className="text-lg font-semibold text-primary mb-3 border-b border-border pb-1"
                  >
                    {letter}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {list.map((brand) => {
                      const id = brand._id || String(brand.id || "");
                      const name = brand.name || brand.brandName || "Marque";
                      if (!id) return null;
                      return (
                        <li key={brandKey(brand)}>
                          <Link
                            href={productsByBrandHref(id, name)}
                            className="block rounded-md px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </main>
    </SiteChrome>
  );
}

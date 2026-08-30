/**
 * Loader pass-through (pas d'optimisation Vercel) — aligné dashboard.
 * Next exige que l'URL retournée référence `width` ; le fragment `#w=`
 * satisfait ce contrôle sans être envoyé au CDN (les navigateurs l'ignorent
 * pour la requête HTTP de l'image).
 */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const base = src.split("#")[0] ?? src;
  return `${base}#w=${width}`;
}

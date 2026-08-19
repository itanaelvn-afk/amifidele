/**
 * Loader personnalisé aligné sur le dashboard:
 * on renvoie l'URL source telle quelle pour désactiver
 * l'optimisation d'images côté Vercel.
 */
export default function imageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return src;
}

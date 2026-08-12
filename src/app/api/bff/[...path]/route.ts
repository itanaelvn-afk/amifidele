import { NextRequest, NextResponse } from "next/server";

/**
 * BFF public : proxy GET vers api-amifidele.
 * La clé `x-api-key` reste côté serveur (jamais exposée au navigateur).
 */

const ALLOWED_ROOTS = new Set([
  "products",
  "categories",
  "brands",
  "advertisers",
]);

function getUpstreamBase(): string {
  const raw =
    process.env.API_URL ||
    process.env.API_UPSTREAM_URL ||
    "http://localhost:4000/api";
  return raw.replace(/\/$/, "");
}

function getApiToken(): string | null {
  return (
    process.env.API_TOKEN ||
    process.env.API_KEY ||
    process.env.API_TOKEN_AUTH ||
    null
  );
}

function isPathAllowed(segments: string[]): boolean {
  if (!segments.length) return false;
  if (segments.some((s) => s.includes("..") || s.includes("\\"))) return false;
  return ALLOWED_ROOTS.has(segments[0]);
}

async function proxyGet(
  request: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  if (!isPathAllowed(pathSegments)) {
    return NextResponse.json({ message: "Chemin non autorisé" }, { status: 403 });
  }

  const token = getApiToken();
  if (!token) {
    console.error("BFF : API_TOKEN / API_KEY manquant (variable serveur)");
    return NextResponse.json(
      { message: "Configuration API serveur incomplète" },
      { status: 500 }
    );
  }

  const path = pathSegments.map(encodeURIComponent).join("/");
  const upstream = new URL(`${getUpstreamBase()}/${path}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.append(key, value);
  });

  // Filet public : jamais exposer les produits masqués via le BFF
  if (pathSegments[0] === "products") {
    upstream.searchParams.set("isVisible", "true");
  }

  try {
    const upstreamRes = await fetch(upstream.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": token,
      },
      // Pas de cache Next agressif ici : le client / lib peut revalidate
      cache: "no-store",
    });

    const contentType = upstreamRes.headers.get("content-type") || "application/json";
    const body = await upstreamRes.arrayBuffer();

    return new NextResponse(body, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    console.error("BFF : erreur proxy vers l'API", err);
    return NextResponse.json(
      { message: "Erreur de communication avec l'API" },
      { status: 502 }
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyGet(request, path ?? []);
}

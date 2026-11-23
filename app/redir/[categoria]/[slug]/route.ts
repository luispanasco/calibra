import { NextResponse, type NextRequest } from "next/server";
import { getProductByLegacySlug } from "@/lib/data";
import { productUrl } from "@/lib/links";

/**
 * Destino del rewrite de next.config (slugs que no empiezan con "sca"): las URLs
 * con el modelo de fábrica de antes del 2026-11-23 (/balanceadoras/kwb-60a) →
 * 308 a la ficha actual. Si no corresponde a ningún equipo, 404.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ categoria: string; slug: string }> }) {
  const { categoria, slug } = await params;
  const p = await getProductByLegacySlug(categoria, slug);
  if (p) return NextResponse.redirect(new URL(productUrl(p), request.url), 308);

  const html = `<!doctype html><html lang="es-UY"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página no encontrada | Calibra</title><body style="font-family:system-ui,sans-serif;color:#2b2b2d;max-width:32rem;margin:4rem auto;padding:0 1rem"><h1 style="color:#f8772f">Página no encontrada</h1><p>Este equipo no existe o cambió de dirección.</p><p><a href="/" style="color:#e51e20">Ver todos los equipos Calibra</a></p></body></html>`;
  return new NextResponse(html, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" } });
}

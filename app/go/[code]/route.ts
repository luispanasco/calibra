import { NextResponse, type NextRequest } from "next/server";
import { getProductPathForCode } from "@/lib/data";

/**
 * /go/{código ERP} → ficha del equipo con ese código (links de las cotizaciones
 * del hub y QR impresos). Mismo contrato que /go de launchuruguay y Resfriar.
 * Route handler y no página: así devuelve un 307 real, sin renderizar HTML.
 * 307 y no permanente: un código puede cambiar de ficha.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const path = await getProductPathForCode(safeDecode(code));

  if (!path) {
    const html = `<!doctype html><html lang="es-UY"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Código no encontrado | Calibra</title><body style="font-family:system-ui,sans-serif;color:#2b2b2d;max-width:32rem;margin:4rem auto;padding:0 1rem"><h1 style="color:#f8772f">Código no encontrado</h1><p>No encontramos un equipo con el código <strong>${escapeHtml(code)}</strong>.</p><p><a href="/" style="color:#e51e20">Ver todos los equipos Calibra</a></p></body></html>`;
    return new NextResponse(html, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }

  const res = NextResponse.redirect(new URL(path, request.url), 307);
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

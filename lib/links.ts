export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/$/, "");

export function productUrl(p: { categorySlug: string; slug: string }): string {
  return `/${p.categorySlug}/${p.slug}`;
}

/**
 * Ficha del equipo en la tienda Nami, derivada del código ERP (cb_product.product_code).
 * Mismo formato que el link de compra del catálogo de Launch (hub: lib/catalog-web-links.ts).
 * null si la ficha no tiene código.
 */
export const NAMI_STORE_BASE = "https://www.herramientas.nami.com.uy/productos";
export function namiStoreUrl(productCode: string | null | undefined): string | null {
  const code = (productCode ?? "").trim();
  return code ? `${NAMI_STORE_BASE}/${encodeURIComponent(code)}` : null;
}

/** Link de WhatsApp con el mensaje armado. */
export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function quoteText(p: { title: string; model: string; whatsappText?: string }): string {
  return p.whatsappText || `Hola, quiero cotizar este equipo: Calibra ${p.model} – ${p.title}.`;
}

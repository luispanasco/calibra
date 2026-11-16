export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/$/, "");

export function productUrl(p: { categorySlug: string; slug: string }): string {
  return `/${p.categorySlug}/${p.slug}`;
}

/** Link de WhatsApp con el mensaje armado. */
export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function quoteText(p: { title: string; model: string; whatsappText?: string }): string {
  return p.whatsappText || `Hola, quiero cotizar este equipo: Calibra ${p.model} – ${p.title}.`;
}

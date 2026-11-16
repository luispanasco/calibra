// Loaders del catálogo Calibra (tablas cb_* del proyecto web, las edita el hub en
// /calibra). Todo se normaliza acá para que las páginas no tengan que defenderse
// de nulls ni de jsonb mal formado.
//
// cb_product.sections usa el shape canónico del catálogo de launchweb
// ({ id, type, title, variant, items[{label,value?}], text }): "highlights" son
// las características y "specs" la tabla técnica; el resto se muestra genérico.

import { cache } from "react";
import { getSupabase, storageUrl } from "./supabase";

export type Pair = { label: string; value: string };

export type Category = {
  slug: string;
  title: string;
  shortDescription: string;
  image: string; // URL pública ("" si no tiene)
  seoTitle: string;
  seoDescription: string;
};

export type ExtraSection = { id: string; title: string; items: Pair[]; text: string };

export type Product = {
  slug: string;
  model: string;
  categorySlug: string;
  title: string;
  shortDescription: string;
  badge: string;
  isFeatured: boolean;
  order: number;
  heroSpecs: Pair[];
  heroHighlights: string[];
  features: string[];
  specs: Pair[];
  extraSections: ExtraSection[];
  images: string[]; // URLs públicas
  whatsappText: string;
  seoTitle: string;
  seoDescription: string;
};

export type Site = {
  whatsapp: string;
  heroTitle: string;
  heroSubtitle: string;
  launchUrl: string;
};

export const DEFAULT_SITE: Site = {
  whatsapp: "59898155763",
  heroTitle: "Elevadores, desenllantadoras y balanceadoras",
  heroSubtitle: "Equipos pesados y precisos para el taller que trabaja en serio: levantan toneladas y miden gramos.",
  launchUrl: "https://www.launchuruguay.com.uy",
};

// --- normalizadores ----------------------------------------------------------

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());

function pairs(v: unknown): Pair[] {
  if (!Array.isArray(v)) return [];
  return v.map((p) => ({ label: str(p?.label), value: str(p?.value) })).filter((p) => p.label && p.value);
}

function seo(v: unknown): { title: string; description: string } {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return { title: str(o.title), description: str(o.description) };
}

type RawSection = { id?: unknown; type?: unknown; title?: unknown; items?: unknown; text?: unknown };

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapCategory(r: any): Category {
  const s = seo(r.seo);
  return {
    slug: r.slug,
    title: str(r.title) || r.slug,
    shortDescription: str(r.short_description),
    image: storageUrl(str(r.image)),
    seoTitle: s.title,
    seoDescription: s.description,
  };
}

function mapProduct(r: any): Product {
  const s = seo(r.seo);
  const sections: RawSection[] = Array.isArray(r.sections) ? r.sections : [];
  const features: string[] = [];
  const specs: Pair[] = [];
  const extraSections: ExtraSection[] = [];
  for (const sec of sections) {
    const items = Array.isArray(sec.items)
      ? sec.items.map((it: any) => ({ label: str(it?.label), value: str(it?.value) })).filter((it: Pair) => it.label)
      : [];
    if (sec.type === "highlights") features.push(...items.map((it: Pair) => (it.value ? `${it.label}: ${it.value}` : it.label)));
    else if (sec.type === "specs") specs.push(...items.filter((it: Pair) => it.value));
    else if (items.length || str(sec.text)) {
      extraSections.push({ id: str(sec.id) || `s${extraSections.length}`, title: str(sec.title), items, text: str(sec.text) });
    }
  }
  const cta = (r.cta && typeof r.cta === "object" ? r.cta : {}) as Record<string, unknown>;
  return {
    slug: r.slug,
    model: str(r.model),
    categorySlug: r.category_slug,
    title: str(r.title),
    shortDescription: str(r.short_description),
    badge: str(r.badge),
    isFeatured: !!r.is_featured,
    order: typeof r.order === "number" ? r.order : 999,
    heroSpecs: pairs(r.hero_specs),
    heroHighlights: Array.isArray(r.hero_highlights) ? r.hero_highlights.map(str).filter(Boolean) : [],
    features,
    specs,
    extraSections,
    images: (Array.isArray(r.images) ? r.images : []).map((p: unknown) => storageUrl(str(p))).filter(Boolean),
    whatsappText: str(cta.whatsappText),
    seoTitle: s.title,
    seoDescription: s.description,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// --- loaders -----------------------------------------------------------------

export const getCategories = cache(async (): Promise<Category[]> => {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("cb_category").select("*").order("order");
  if (error) {
    console.error("cb_category", error.message);
    return [];
  }
  return (data ?? []).map(mapCategory);
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("cb_product").select("*").order("order").order("model");
  if (error) {
    console.error("cb_product", error.message);
    return [];
  }
  const catOrder = new Map((await getCategories()).map((c, n) => [c.slug, n]));
  // Un producto de una categoría oculta no se muestra (RLS ya esconde la categoría).
  // Orden: el de las categorías, y dentro de cada una el del producto.
  return (data ?? [])
    .map(mapProduct)
    .filter((p) => catOrder.has(p.categorySlug))
    .sort((a, b) => catOrder.get(a.categorySlug)! - catOrder.get(b.categorySlug)! || a.order - b.order);
});

export async function getCategory(slug: string): Promise<Category | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getProduct(categorySlug: string, slug: string): Promise<Product | null> {
  return (await getProducts()).find((p) => p.slug === slug && p.categorySlug === categorySlug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.categorySlug === slug);
}

export const getSite = cache(async (): Promise<Site> => {
  const sb = getSupabase();
  if (!sb) return DEFAULT_SITE;
  const { data } = await sb.from("cb_singleton").select("data").eq("key", "site").maybeSingle();
  const o = (data?.data && typeof data.data === "object" ? data.data : {}) as Record<string, unknown>;
  return {
    whatsapp: str(o.whatsapp).replace(/\D/g, "") || DEFAULT_SITE.whatsapp,
    heroTitle: str(o.heroTitle) || DEFAULT_SITE.heroTitle,
    heroSubtitle: str(o.heroSubtitle) || DEFAULT_SITE.heroSubtitle,
    launchUrl: str(o.launchUrl) || DEFAULT_SITE.launchUrl,
  };
});

/** Foto representativa de una categoría: la propia o la del primer equipo. */
export function categoryImage(cat: Category, products: Product[]): string {
  if (cat.image) return cat.image;
  const first = products.find((p) => p.categorySlug === cat.slug && p.images[0]);
  return first?.images[0] ?? "";
}

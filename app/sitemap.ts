import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { SITE_URL, productUrl } from "@/lib/links";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/contacto`, priority: 0.6 },
    ...categories.map((c) => ({ url: `${SITE_URL}/${c.slug}`, priority: 0.8 })),
    ...categories
      .filter((c) => products.filter((p) => p.categorySlug === c.slug).length > 1)
      .map((c) => ({ url: `${SITE_URL}/${c.slug}/comparar`, priority: 0.5 })),
    ...products.map((p) => ({ url: `${SITE_URL}${productUrl(p)}`, priority: 0.7 })),
  ];
}

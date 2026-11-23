import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comparator, type CompareItem } from "@/components/Comparator";
import { getCategories, getCategory, getProductsByCategory, getSite } from "@/lib/data";
import { productUrl, quoteText, whatsappUrl } from "@/lib/links";

export const revalidate = 300;

type Props = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategory((await params).categoria);
  if (!cat) return {};
  return {
    title: `Comparar ${cat.title.toLowerCase()}`,
    description: `Compará las ${cat.title.toLowerCase()} Calibra lado a lado: especificaciones, usos y características.`,
    alternates: { canonical: `/${cat.slug}/comparar` },
  };
}

export default async function ComparePage({ params }: Props) {
  const { categoria } = await params;
  const [cat, products, site] = await Promise.all([getCategory(categoria), getProductsByCategory(categoria), getSite()]);
  if (!cat || products.length === 0) notFound();

  // Solo lo que la tabla muestra: el componente es de cliente y viaja serializado.
  const items: CompareItem[] = products.map((p) => ({
    slug: p.slug,
    model: p.model,
    title: p.title,
    image: p.images[0] ?? "",
    url: productUrl(p),
    quoteUrl: whatsappUrl(site.whatsapp, quoteText(p)),
    uses: p.uses,
    specs: p.specs,
    features: p.features,
  }));

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-50" />
        <div
          aria-hidden
          className="lights-on absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 55% 70% at 85% 0%, rgb(255 255 255 / 0.08), transparent 70%), radial-gradient(ellipse 40% 60% at 0% 100%, rgb(248 119 47 / 0.12), transparent 70%)" }}
        />
        <div className="container-cb py-12 sm:py-14">
          <nav aria-label="Ruta" className="mono text-xs uppercase tracking-[0.18em] text-grey">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <span className="mx-2 text-orange">/</span>
            <Link href={`/${cat.slug}`} className="hover:text-white">{cat.title}</Link>
          </nav>
          <p className="eyebrow mt-8">{cat.title}</p>
          <h1 className="display metal mt-3 text-[clamp(2.2rem,7vw,4.6rem)]">Compará modelos</h1>
          <p className="mt-4 max-w-2xl text-lg text-fog">
            Elegí hasta 4 equipos y miralos lado a lado. Las filas donde difieren quedan marcadas.
          </p>
        </div>
        <div className="ruler absolute inset-x-0 bottom-0 opacity-40" aria-hidden />
      </section>

      <Comparator items={items} />
    </>
  );
}

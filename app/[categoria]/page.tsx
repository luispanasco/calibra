import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Icons";
import { getCategories, getCategory, getProductsByCategory, getSite } from "@/lib/data";
import { whatsappUrl } from "@/lib/links";

export const revalidate = 300;

type Props = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategory((await params).categoria);
  if (!cat) return {};
  return {
    title: cat.seoTitle || cat.title,
    description: cat.seoDescription || cat.shortDescription,
    alternates: { canonical: `/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const [cat, products, site] = await Promise.all([getCategory(categoria), getProductsByCategory(categoria), getSite()]);
  if (!cat) notFound();

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-50" />
        <div
          aria-hidden
          className="lights-on absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 55% 70% at 85% 0%, rgb(255 255 255 / 0.09), transparent 70%), radial-gradient(ellipse 40% 50% at 0% 100%, rgb(248 119 47 / 0.12), transparent 70%)" }}
        />
        <div className="container-cb py-16 sm:py-24">
          <p className="eyebrow">
            {products.length} {products.length === 1 ? "modelo" : "modelos"}
          </p>
          <h1 className="display metal mt-4 text-[clamp(3rem,10vw,8rem)]">{cat.title}</h1>
          {cat.shortDescription && <p className="mt-5 max-w-xl text-lg text-fog">{cat.shortDescription}</p>}
          <a
            href={whatsappUrl(site.whatsapp, `Hola, quiero cotizar ${cat.title.toLowerCase()} Calibra.`)}
            target="_blank"
            rel="noopener"
            className="btn btn-ghost mt-8"
          >
            <WhatsAppIcon className="h-4 w-4" /> Consultar por {cat.title.toLowerCase()}
          </a>
        </div>
        <div className="ruler absolute inset-x-0 bottom-0 opacity-40" aria-hidden />
      </section>

      <section className="container-cb pt-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.slug} className="reveal">
              <ProductCard p={p} categoryTitle={cat.title} />
            </div>
          ))}
        </div>
        {products.length === 0 && <p className="text-fog">Pronto vas a ver los equipos de esta línea acá.</p>}
      </section>
    </>
  );
}

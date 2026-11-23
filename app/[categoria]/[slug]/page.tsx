import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { UseTags } from "@/components/UseTags";
import { CartIcon, WhatsAppIcon } from "@/components/Icons";
import { getCategory, getProduct, getProducts, getProductsByCategory, getSite } from "@/lib/data";
import { namiStoreUrl, quoteText, whatsappUrl } from "@/lib/links";

export const revalidate = 300;

type Props = { params: Promise<{ categoria: string; slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ categoria: p.categorySlug, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, slug } = await params;
  const p = await getProduct(categoria, slug);
  if (!p) return {};
  return {
    title: p.seoTitle || `${p.model} · ${p.title}`,
    description: p.seoDescription || p.shortDescription,
    alternates: { canonical: `/${p.categorySlug}/${p.slug}` },
    openGraph: p.images[0] ? { images: [p.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { categoria, slug } = await params;
  const [p, cat, site] = await Promise.all([getProduct(categoria, slug), getCategory(categoria), getSite()]);
  if (!p || !cat) notFound();
  const related = (await getProductsByCategory(cat.slug)).filter((x) => x.slug !== p.slug).slice(0, 3);
  const quote = whatsappUrl(site.whatsapp, quoteText(p));
  const buy = namiStoreUrl(p.productCode);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-50" />
        <div
          aria-hidden
          className="lights-on absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 45% 60% at 70% 0%, rgb(255 255 255 / 0.12), transparent 70%), radial-gradient(ellipse 40% 30% at 70% 95%, rgb(248 119 47 / 0.16), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="display outline-text pointer-events-none absolute -right-[0.05em] top-6 -z-10 whitespace-nowrap text-[18vw] leading-none"
        >
          {p.model}
        </div>

        <div className="container-cb grid gap-10 py-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-16">
          <div className="order-2 lg:order-1">
            <nav aria-label="Ruta" className="mono text-xs uppercase tracking-[0.18em] text-grey">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2 text-orange">/</span>
              <Link href={`/${cat.slug}`} className="hover:text-white">{cat.title}</Link>
            </nav>
            <p className="eyebrow mt-8">{p.title}</p>
            <h1 className="display metal mt-3 whitespace-nowrap text-[clamp(2.4rem,11vw,5.2rem)] lg:text-[clamp(3rem,5.4vw,5.2rem)]">{p.model}</h1>
            <UseTags uses={p.uses} size="md" className="mt-5" />
            {p.shortDescription && <p className="mt-5 max-w-lg text-lg leading-relaxed text-fog">{p.shortDescription}</p>}

            {p.heroHighlights.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {p.heroHighlights.map((h) => (
                  <li key={h} className="chip">{h}</li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={quote} target="_blank" rel="noopener" className="btn btn-primary">
                <WhatsAppIcon className="h-4 w-4" /> Pedir cotización
              </a>
              {buy && (
                <a href={buy} target="_blank" rel="noopener" className="btn btn-ghost">
                  <CartIcon className="h-4 w-4" /> Comprar en Nami
                </a>
              )}
              <a href="#ficha" className="btn btn-ghost">Ficha técnica</a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Gallery images={p.images} alt={`Calibra ${p.model}`} />
          </div>
        </div>

        {p.heroSpecs.length > 0 && (
          <div className="border-t border-white/[0.06] bg-graphite/80 backdrop-blur">
            <dl className="container-cb grid grid-cols-2 lg:grid-cols-4">
              {p.heroSpecs.map((s, n) => (
                <div key={s.label} className={`px-1 py-6 sm:px-6 ${n % 2 ? "" : "border-r"} border-white/[0.06] lg:border-r lg:last:border-r-0`}>
                  <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-grey">{s.label}</dt>
                  <dd className="display mt-2 text-[clamp(1.5rem,3vw,2.4rem)] text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      <section id="ficha" className="container-cb grid scroll-mt-20 gap-12 pt-20 lg:grid-cols-[1fr_1.1fr]">
        {p.features.length > 0 && (
          <div className="reveal">
            <p className="eyebrow">Características</p>
            <h2 className="display mt-3 text-4xl text-white">Hecha para trabajar</h2>
            <ul className="mt-8 space-y-px bg-white/[0.06]">
              {p.features.map((f, n) => (
                <li key={n} className="flex gap-4 bg-ink py-4 pr-2">
                  <span className="mono w-8 shrink-0 pt-0.5 text-xs text-orange">{String(n + 1).padStart(2, "0")}</span>
                  <span className="text-fog">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.specs.length > 0 && (
          <div className="reveal">
            <p className="eyebrow">Especificaciones</p>
            <h2 className="display mt-3 text-4xl text-white">Ficha técnica</h2>
            <div className="mt-8 border border-white/10 bg-graphite">
              <div className="ruler opacity-40" aria-hidden />
              <dl>
                {p.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[1fr_auto] gap-6 border-t border-white/[0.06] px-5 py-3.5 first:border-t-0 sm:grid-cols-[1fr_1fr]">
                    <dt className="text-sm text-fog">{s.label}</dt>
                    <dd className="mono text-right text-sm font-semibold text-white sm:text-left">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </section>

      {p.extraSections.map((sec) => (
        <section key={sec.id} className="container-cb reveal pt-16">
          {sec.title && <h2 className="display text-3xl text-white">{sec.title}</h2>}
          {sec.text && <p className="mt-4 max-w-3xl whitespace-pre-line text-fog">{sec.text}</p>}
          {sec.items.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {sec.items.map((it, n) => (
                <li key={n} className="border border-white/[0.07] bg-graphite p-4 text-fog">
                  {it.value ? (
                    <>
                      <span className="font-semibold text-white">{it.label}:</span> {it.value}
                    </>
                  ) : (
                    it.label
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="container-cb pt-20">
        <div className="reveal flex flex-col items-start justify-between gap-6 border border-orange/30 bg-gradient-to-r from-orange/10 to-transparent p-8 sm:flex-row sm:items-center">
          <div>
            <p className="display text-2xl text-white">¿La {p.model} es para tu taller?</p>
            <p className="mt-1 text-fog">
              {buy
                ? "Comprala en la tienda Nami, o pedinos precio, disponibilidad y plazo de entrega por WhatsApp."
                : "Te pasamos precio, disponibilidad y plazo de entrega por WhatsApp."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={quote} target="_blank" rel="noopener" className="btn btn-primary">
              <WhatsAppIcon className="h-4 w-4" /> Pedir cotización
            </a>
            {buy && (
              <a href={buy} target="_blank" rel="noopener" className="btn btn-ghost">
                <CartIcon className="h-4 w-4" /> Comprar en Nami
              </a>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-cb pt-24">
          <p className="eyebrow">Más {cat.title.toLowerCase()}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ProductCard key={r.slug} p={r} categoryTitle={cat.title} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

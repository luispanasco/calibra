import Link from "next/link";
import { HeroStage, type HeroSlide } from "@/components/HeroStage";
import { Machine } from "@/components/Machine";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, ArrowUpRight, WhatsAppIcon } from "@/components/Icons";
import { LaunchWordmark } from "@/components/LaunchWordmark";
import { categoryImage, getCategories, getProducts, getSite } from "@/lib/data";
import { productUrl, whatsappUrl } from "@/lib/links";

export const revalidate = 300;

// Cifras de la línea, para la banda "medido al detalle". Se buscan en las fichas
// y la banda se arma solo con las que existen.
const FIGURES: { find: (label: string) => boolean; caption: string }[] = [
  { find: (l) => /^capacidad$/i.test(l), caption: "de capacidad de elevación" },
  { find: (l) => /^precisi/i.test(l), caption: "de precisión de balanceo" },
  { find: (l) => /rueda m[aá]xima/i.test(l), caption: "de diámetro de rueda" },
  { find: (l) => /presi[oó]n hidr/i.test(l), caption: "de presión hidráulica" },
];

export default async function HomePage() {
  const [categories, products, site] = await Promise.all([getCategories(), getProducts(), getSite()]);
  const catTitle = new Map(categories.map((c) => [c.slug, c.title]));

  const featured = products.filter((p) => p.isFeatured && p.images[0]);
  const slides: HeroSlide[] = (featured.length ? featured : products.filter((p) => p.images[0])).slice(0, 6).map((p) => ({
    slug: p.slug,
    model: p.model,
    title: p.title,
    category: catTitle.get(p.categorySlug) ?? "",
    image: p.images[0],
    url: productUrl(p),
    specs: p.heroSpecs,
  }));

  // Extremos de la línea: el valor más alto de cada cifra (comparando el número).
  const figures = FIGURES.map((f) => {
    let best: { value: string; num: number; model: string } | null = null;
    for (const p of products) {
      const s = p.heroSpecs.find((h) => f.find(h.label));
      if (!s) continue;
      const num = Number(s.value.replace(/[^\d,]/g, "").replace(",", "."));
      const isPrecision = /precisi/i.test(s.label);
      const score = isPrecision ? -num : num;
      if (!best || score > best.num) best = { value: s.value, num: score, model: p.model };
    }
    return best ? { ...best, caption: f.caption } : null;
  }).filter((x): x is NonNullable<typeof x> => !!x);

  const ticker = products.map((p) => `${p.model} · ${p.heroSpecs[0]?.value ?? p.title}`);
  const quote = whatsappUrl(site.whatsapp, "Hola, quiero cotizar equipos Calibra para mi taller.");

  return (
    <>
      <HeroStage slides={slides} title={site.heroTitle} subtitle={site.heroSubtitle} quoteUrl={quote} />

      {/* Ticker de modelos */}
      {ticker.length > 0 && (
        <div className="overflow-hidden border-b border-white/[0.06] bg-graphite py-3" aria-hidden>
          <div className="ticker-track flex w-max gap-10">
            {[...ticker, ...ticker].map((t, n) => (
              <span key={n} className="mono flex items-center gap-10 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-grey">
                {t} <span className="h-1.5 w-1.5 rotate-45 bg-orange" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categorías */}
      <section id="equipos" className="container-cb scroll-mt-20 pt-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">La línea</p>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,4rem)] text-white">Tres frentes del taller</h2>
          </div>
          <p className="max-w-sm text-fog">Levantar, desmontar y balancear: los equipos que más trabajan, con la robustez que piden todos los días.</p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {categories.map((c, n) => {
            const count = products.filter((p) => p.categorySlug === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="reveal corners group relative flex min-h-[460px] flex-col overflow-hidden border border-white/[0.07] bg-gradient-to-b from-panel via-graphite to-ink p-7"
              >
                <span className="display outline-text absolute -right-2 top-2 text-[7rem] leading-none" aria-hidden>
                  0{n + 1}
                </span>
                <span className="mono text-xs uppercase tracking-[0.22em] text-orange">
                  {count} {count === 1 ? "modelo" : "modelos"}
                </span>
                <h3 className="display mt-2 text-4xl text-white">{c.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-fog">{c.shortDescription}</p>
                <div className="relative mt-auto h-56 transition-transform duration-700 ease-out group-hover:scale-105">
                  <Machine src={categoryImage(c, products)} alt={c.title} sizes="(min-width:1024px) 420px, 100vw" reflection={false} className="h-full" />
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">
                  Ver {c.title.toLowerCase()} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Medido al detalle */}
      {figures.length > 0 && (
        <section className="relative mt-28 overflow-hidden border-y border-white/[0.06] bg-graphite">
          <div className="ruler absolute inset-x-0 top-0 opacity-50" aria-hidden />
          <div className="container-cb py-16">
            <p className="eyebrow reveal">Medido al detalle</p>
            <div className="mt-8 grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              {figures.map((f) => (
                <div key={f.caption} className="reveal bg-graphite p-6">
                  <div className="display metal whitespace-nowrap text-[clamp(2.2rem,3.2vw,2.9rem)]">{f.value}</div>
                  <p className="mt-2 text-sm text-fog">{f.caption}</p>
                  <p className="mono mt-4 text-[0.68rem] uppercase tracking-[0.2em] text-grey">{f.model}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="ruler absolute inset-x-0 bottom-0 rotate-180 opacity-50" aria-hidden />
        </section>
      )}

      {/* Todos los equipos */}
      <section className="container-cb pt-28">
        <div className="reveal">
          <p className="eyebrow">Equipos disponibles</p>
          <h2 className="display mt-3 text-[clamp(2.2rem,5vw,4rem)] text-white">Elegí tu máquina</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div key={p.slug} className="reveal">
              <ProductCard p={p} categoryTitle={catTitle.get(p.categorySlug)} />
            </div>
          ))}
        </div>
        {products.length === 0 && <p className="mt-10 text-fog">Estamos cargando los equipos. Mientras tanto, consultanos por WhatsApp.</p>}
      </section>

      {/* Referencia cruzada a Launch Uruguay, con su identidad (Space Grotesk + rojo). */}
      <section className="relative mt-28 overflow-hidden border-y border-launch/30 bg-[#0d0708]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 90% at 85% 50%, rgb(223 29 48 / 0.28), transparent 70%), radial-gradient(ellipse 30% 60% at 10% 100%, rgb(223 29 48 / 0.12), transparent 70%)",
          }}
        />
        <div aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-launch" />
        <a
          href={site.launchUrl}
          target="_blank"
          rel="noopener"
          className="group container-cb relative grid items-center gap-8 py-16 lg:grid-cols-[1.5fr_1fr] lg:py-20"
        >
          <div className="reveal">
            <p className="font-launch text-sm font-bold uppercase tracking-[0.2em] text-launch">También de nuestro equipo</p>
            <LaunchWordmark className="mt-4 text-[clamp(2.6rem,8vw,6.5rem)]" />
            <p className="mt-5 max-w-xl font-launch text-lg text-fog">
              Scanners, diagnóstico y equipamiento automotriz. Completá el taller con la otra mitad: el diagnóstico.
            </p>
          </div>
          <div className="reveal lg:justify-self-end">
            <span className="inline-flex items-center gap-3 bg-launch px-7 py-4 font-launch text-base font-bold uppercase tracking-wide text-white shadow-[0_0_40px_-6px_rgb(223_29_48/0.7)] transition-colors group-hover:bg-[#f0283c]">
              Visitar Launch Uruguay <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>
      </section>

      {/* Cierre */}
      <section className="container-cb pt-28">
        <div className="reveal relative overflow-hidden border border-white/10 bg-gradient-to-br from-panel to-ink p-8 sm:p-14">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 50% 80% at 100% 50%, rgb(248 119 47 / 0.18), transparent 70%)" }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="display text-[clamp(2rem,4.5vw,3.6rem)] text-white">
                Armemos el taller <span className="text-orange">juntos</span>
              </h2>
              <p className="mt-4 max-w-lg text-fog">
                Contanos qué trabajás y te recomendamos el equipo justo. Respuesta por WhatsApp con precio y disponibilidad.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href={quote} target="_blank" rel="noopener" className="btn btn-primary">
                <WhatsAppIcon className="h-4 w-4" /> Pedir cotización
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

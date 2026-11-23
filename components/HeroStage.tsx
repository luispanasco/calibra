"use client";

// Hero del home: rota los equipos destacados sobre el escenario iluminado. Un
// foco sigue al puntero (variables CSS --mx/--my) y el láser barre la máquina.
// Sin JS (o con reduced motion) queda fijo en el primero, que ya viene en el HTML.

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Machine } from "./Machine";
import { ArrowRight, WhatsAppIcon } from "./Icons";

export type HeroSlide = {
  slug: string;
  model: string;
  title: string;
  category: string;
  image: string;
  url: string;
  specs: { label: string; value: string }[];
};

const INTERVAL = 6500;

export function HeroStage({
  slides,
  title,
  subtitle,
  quoteUrl,
}: {
  slides: HeroSlide[];
  title: string;
  subtitle: string;
  quoteUrl: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, slides.length]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  const s = slides[i];

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate overflow-hidden border-b border-white/[0.06] [--mx:70%] [--my:35%]"
    >
      {/* Luz ambiente: foco que sigue al puntero + halo naranja bajo + grilla técnica. */}
      <div
        aria-hidden
        className="lights-on pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx) var(--my), rgb(255 255 255 / 0.07), transparent 60%), radial-gradient(ellipse 60% 40% at 72% 92%, rgb(248 119 47 / 0.16), transparent 70%), radial-gradient(ellipse 80% 60% at 70% 10%, rgb(160 170 185 / 0.10), transparent 70%)",
        }}
      />
      <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
      {/* El modelo actual, gigante y calado detrás de la máquina: el título del hero es la máquina. */}
      {slides.map((sl, n) => (
        <div
          key={sl.slug}
          aria-hidden
          className={`display outline-text pointer-events-none absolute right-[-0.04em] top-[8%] -z-10 whitespace-nowrap text-[clamp(6rem,19vw,22rem)] leading-none transition-opacity duration-1000 ${
            n === i ? "opacity-100" : "opacity-0"
          }`}
        >
          {sl.model}
        </div>
      ))}

      {/* grid-cols-[minmax(0,1fr)]: sin esto la columna crece al ancho de la tira de modelos y desborda en celular */}
      <div className="container-cb grid min-h-[min(calc(100svh-4rem),1000px)] grid-cols-[minmax(0,1fr)] items-center gap-4 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10 lg:py-0">
        <div className="relative z-10 order-2 min-w-0 lg:order-1">
          <p className="eyebrow">Maquinaria de taller · Auto y camión</p>
          <h1 className="display mt-4 text-[clamp(1.5rem,6.9vw,2.9rem)] !leading-[1.02] text-white [hyphens:auto] lg:text-[clamp(2.1rem,3.2vw,2.9rem)]">{title}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-fog lg:text-xl">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={quoteUrl} target="_blank" rel="noopener" className="btn btn-primary">
              <WhatsAppIcon className="h-4 w-4" /> Pedir cotización
            </a>
            <a href="#equipos" className="btn btn-ghost">
              Ver equipos <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {s && (
          <div className="relative order-1 min-w-0 lg:order-2">
            <div className="relative mx-auto h-[min(58vw,420px)] w-full sm:h-[min(56vw,560px)] lg:h-[min(58svh,600px)]">
              <div className="laser" aria-hidden />
              {slides.map((sl, n) => (
                <div
                  key={sl.slug}
                  aria-hidden={n !== i}
                  className={`absolute inset-x-0 bottom-[12%] top-0 transition-all duration-1000 ease-out ${
                    n === i ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none translate-x-10 scale-[0.97] opacity-0"
                  }`}
                >
                  <Machine src={sl.image} alt={`Calibra ${sl.model}`} sizes="(min-width:1024px) 1000px, 100vw" priority={n === 0} className="h-full" />
                </div>
              ))}
            </div>

            {/* Lectura de la máquina actual, como un instrumento. */}
            <div className="relative mx-auto -mt-2 max-w-[760px] border border-white/10 bg-graphite/70 backdrop-blur-md">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 px-5 py-3">
                <Link href={s.url} className="group min-w-0">
                  <span className="mono block text-[0.7rem] uppercase tracking-[0.2em] text-orange">{s.category}</span>
                  <span className="display block truncate text-xl text-white group-hover:text-orange">{s.model}</span>
                </Link>
                <Link href={s.url} className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-fog hover:text-white">
                  Ver ficha →
                </Link>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4">
                {s.specs.slice(0, 4).map((sp) => (
                  <div key={sp.label} className="border-white/10 px-5 py-3 [&:not(:last-child)]:border-r">
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-grey">{sp.label}</dt>
                    <dd className="mono mt-1 text-lg font-semibold text-white">{sp.value}</dd>
                  </div>
                ))}
              </dl>
              {slides.length > 1 && (
                <div className="flex overflow-x-auto border-t border-white/10 [scrollbar-width:none]" role="tablist" aria-label="Equipos destacados">
                  {slides.map((sl, n) => (
                    <button
                      key={sl.slug}
                      role="tab"
                      aria-selected={n === i}
                      onClick={() => setI(n)}
                      className="group relative flex-1 shrink-0 whitespace-nowrap px-3 py-2.5 text-center"
                    >
                      <span className={`mono text-[0.65rem] uppercase tracking-[0.12em] ${n === i ? "text-white" : "text-grey group-hover:text-fog"}`}>
                        {sl.model}
                      </span>
                      <span
                        className={`absolute inset-x-0 top-0 h-px origin-left bg-orange ${n === i ? "scale-x-100" : "scale-x-0"}`}
                        style={n === i && !paused ? { transition: `transform ${INTERVAL}ms linear` } : undefined}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

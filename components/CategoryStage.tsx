"use client";

// Escenario de la cabecera de una categoría: rota las máquinas de esa línea
// (una foto por equipo) iluminadas, con modelo, dos cifras y link a la ficha.
// Pausa al pasar el mouse; con reduced motion queda fija en la primera.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Machine } from "./Machine";

export type StageSlide = {
  slug: string;
  model: string;
  title: string;
  image: string;
  url: string;
  specs: { label: string; value: string }[];
};

const INTERVAL = 4500;

export function CategoryStage({ slides }: { slides: StageSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, slides.length]);

  const s = slides[i];
  if (!s) return null;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative">
      <div className="relative mx-auto h-[min(62vw,380px)] w-full lg:h-[420px]">
        <div className="laser" aria-hidden />
        {slides.map((sl, n) => (
          <Link
            key={sl.slug}
            href={sl.url}
            aria-hidden={n !== i}
            tabIndex={n === i ? 0 : -1}
            aria-label={`Ver ${sl.model}`}
            className={`absolute inset-x-0 bottom-[12%] top-0 transition-all duration-700 ease-out ${
              n === i ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-8 opacity-0"
            }`}
          >
            <Machine src={sl.image} alt={`Calibra ${sl.model}`} sizes="(min-width:1024px) 640px, 100vw" priority={n === 0} className="h-full" />
          </Link>
        ))}
      </div>

      <div className="relative mx-auto -mt-2 max-w-[640px] border border-white/10 bg-graphite/70 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <Link href={s.url} className="group min-w-0">
            <span className="display block truncate text-xl text-white group-hover:text-orange">{s.model}</span>
            <span className="block truncate text-sm text-fog">{s.title}</span>
          </Link>
          <dl className="hidden shrink-0 gap-6 sm:flex">
            {s.specs.slice(0, 2).map((sp) => (
              <div key={sp.label} className="text-right">
                <dt className="text-[0.6rem] uppercase tracking-[0.16em] text-grey">{sp.label}</dt>
                <dd className="mono text-sm font-semibold text-white">{sp.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {slides.length > 1 && (
          <div className="flex border-t border-white/10" role="tablist" aria-label="Equipos de la categoría">
            {slides.map((sl, n) => (
              <button
                key={sl.slug}
                role="tab"
                aria-selected={n === i}
                aria-label={sl.model}
                onClick={() => setI(n)}
                className="group relative h-8 flex-1"
              >
                <span className={`absolute inset-x-2 top-1/2 h-px -translate-y-1/2 ${n === i ? "bg-white/25" : "bg-white/10 group-hover:bg-white/25"}`} />
                <span
                  className={`absolute left-2 top-1/2 h-px -translate-y-1/2 bg-orange ${n === i ? "right-2" : "right-full"}`}
                  style={n === i && !paused ? { transition: `right ${INTERVAL}ms linear` } : undefined}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

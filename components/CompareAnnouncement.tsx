"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CompareIcon } from "./Icons";

/**
 * Anuncio de primera visita del comparador (como los de launchuruguay: buscador,
 * modo claro). Sale una sola vez por navegador, 1,5 s después de entrar.
 * Si estás en una categoría, el botón lleva a su comparador; si no, elegís cuál.
 */
const STORAGE_KEY = "calibra-compare-announcement-seen";

type Cat = { slug: string; title: string };

function seen(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return true; // sin storage (modo privado estricto) no se insiste en cada página
  }
}

export function CompareAnnouncement({ categories }: { categories: Cat[] }) {
  const pathname = usePathname() ?? "/";
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false); // separado de visible para animar la entrada
  const dialog = useRef<HTMLDivElement>(null);

  const first = pathname.split("/")[1] ?? "";
  const here = categories.find((c) => c.slug === first) ?? null;
  const onCompare = !!here && pathname.split("/")[2] === "comparar";
  const skip = first === "go" || first === "redir" || categories.length === 0;

  useEffect(() => {
    if (skip || seen()) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, [skip]);

  useEffect(() => {
    if (!visible) return;
    const raf = requestAnimationFrame(() => {
      setShown(true);
      dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [visible]);

  function dismiss() {
    setShown(false);
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* sin storage: se cierra igual */
    }
  }

  if (!visible) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={dismiss}
        className={`fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <div className="pointer-events-none fixed inset-0 z-[201] flex items-end justify-center p-3 sm:items-center sm:p-4">
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cmp-ann-title"
          className={`pointer-events-auto relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto border border-white/10 bg-graphite shadow-[0_30px_80px_rgb(0_0_0/0.6)] transition-all duration-500 ${
            shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center text-fog transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className="h-4 w-4">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <Mockup />

          <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
            <p className="eyebrow">Nuevo</p>
            <h2 id="cmp-ann-title" className="display mt-2 text-[1.7rem] leading-none text-white">
              Compará modelos
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fog">
              ¿Dudás entre dos equipos? Ponelos lado a lado y mirá en qué se diferencian.
            </p>

            <ol className="mt-4 space-y-2.5 text-sm">
              {[
                ["Elegí", "hasta 4 equipos de la misma línea."],
                ["Mirá", "las filas marcadas en naranja: ahí está la diferencia."],
                ["Cotizá", "el que te sirve, o compartí el link de la comparación."],
              ].map(([b, t], n) => (
                <li key={b} className="flex gap-3">
                  <span className="mono grid h-5 w-5 shrink-0 place-items-center bg-orange text-[0.65rem] font-bold text-ink">{n + 1}</span>
                  <span className="text-fog">
                    <span className="font-semibold text-white">{b}</span> {t}
                  </span>
                </li>
              ))}
            </ol>

            {here ? (
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                {onCompare ? (
                  <button data-autofocus type="button" onClick={dismiss} className="btn btn-primary flex-1 justify-center">
                    <CompareIcon className="h-4 w-4" /> Empezar
                  </button>
                ) : (
                  <Link data-autofocus href={`/${here.slug}/comparar`} onClick={dismiss} className="btn btn-primary flex-1 justify-center">
                    <CompareIcon className="h-4 w-4" /> Comparar {here.title.toLowerCase()}
                  </Link>
                )}
                {!onCompare && (
                  <button type="button" onClick={dismiss} className="btn btn-ghost justify-center">
                    Ahora no
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="mono mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-grey">¿Qué querés comparar?</p>
                <div className="mt-2.5 grid gap-2">
                  {categories.map((c, n) => (
                    <Link
                      key={c.slug}
                      data-autofocus={n === 0 || undefined}
                      href={`/${c.slug}/comparar`}
                      onClick={dismiss}
                      className="group flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-orange hover:bg-orange/10"
                    >
                      <span className="display text-base text-white">{c.title}</span>
                      <span aria-hidden className="text-orange transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
                <button type="button" onClick={dismiss} className="mono mt-4 w-full py-2 text-xs uppercase tracking-[0.16em] text-grey hover:text-white">
                  Ahora no
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Maqueta del comparador: dos equipos elegidos y una fila que difiere. */
function Mockup() {
  const rows: [string, string, string, boolean][] = [
    ["Precisión", "± 1 g", "± 1 g", false],
    ["Llanta", '10" – 26"', '8" – 28"', true],
    ["Ciclo", "8 s", "8 s", false],
  ];
  return (
    <div aria-hidden className="relative isolate border-b border-white/[0.06] bg-ink px-5 pb-5 pt-12 sm:px-6">
      {/* la grilla va en su propia capa: su máscara no tiene que apagar la maqueta */}
      <div className="tech-grid absolute inset-0 -z-10 opacity-60" />
      <div className="flex gap-1.5">
        {[
          ["Equipo A", true],
          ["Equipo B", true],
          ["Equipo C", false],
        ].map(([m, on]) => (
          <div
            key={m as string}
            className={`flex min-w-0 flex-1 items-center gap-1.5 border px-2 py-1.5 ${on ? "border-orange bg-orange/10" : "border-white/10 bg-white/[0.03]"}`}
          >
            <span className={`grid h-3 w-3 shrink-0 place-items-center border ${on ? "border-orange bg-orange" : "border-white/30"}`}>
              {on && <span className="h-1 w-1 rotate-45 bg-ink" />}
            </span>
            <span className="display truncate text-[0.7rem] text-white">{m}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 border border-white/10 bg-graphite">
        {rows.map(([label, a, b, diff]) => (
          <div
            key={label}
            className={`grid grid-cols-[1fr_1fr_1fr] items-center gap-2 border-t border-white/[0.06] px-3 py-2 text-[0.72rem] first:border-t-0 ${
              diff ? "cmp-ann-pulse bg-orange/[0.08]" : ""
            }`}
          >
            <span className={`flex items-center gap-1.5 ${diff ? "text-orange" : "text-grey"}`}>
              {diff && <span className="h-1.5 w-1.5 rotate-45 bg-orange" />}
              {label}
            </span>
            <span className={`mono ${diff ? "font-semibold text-white" : "text-fog"}`}>{a}</span>
            <span className={`mono ${diff ? "font-semibold text-white" : "text-fog"}`}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

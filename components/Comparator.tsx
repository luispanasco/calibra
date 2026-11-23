"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowRight, WhatsAppIcon } from "./Icons";
import { Machine } from "./Machine";
import { UseTags } from "./UseTags";

export type CompareItem = {
  slug: string;
  model: string;
  title: string;
  image: string;
  url: string;
  quoteUrl: string;
  uses: string[];
  specs: { label: string; value: string }[];
  features: string[];
};

const MAX = 4;

/** Igualdad "a ojo": sin espacios, guiones tipográficos ni mayúsculas. */
const norm = (v: string) => v.toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, "");

type Row = { label: string; values: string[]; differs: boolean };

/** Selección pedida en ?m=slug,slug (válidos, sin repetir, máx. 4; si viene uno, se le suma otro). */
function fromQuery(items: CompareItem[], m: string | null): string[] {
  const wanted = (m ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter((x, n, a) => x && a.indexOf(x) === n && items.some((i) => i.slug === x))
    .slice(0, MAX);
  if (wanted.length === 1) {
    const other = items.find((i) => i.slug !== wanted[0]);
    if (other) wanted.push(other.slug);
  }
  return wanted.length ? wanted : items.slice(0, 2).map((i) => i.slug);
}

/**
 * Tabla comparativa de los equipos de una categoría. La selección vive en la URL
 * (?m=slug,slug) para poder compartir una comparación; sin query entra con los 2
 * primeros. La página es estática: mientras no se lee la query se muestra la
 * selección por defecto (es lo que ve un buscador).
 */
export function Comparator({ items }: { items: CompareItem[] }) {
  return (
    <Suspense fallback={<Table items={items} initial={fromQuery(items, null)} />}>
      <FromUrl items={items} />
    </Suspense>
  );
}

function FromUrl({ items }: { items: CompareItem[] }) {
  const initial = fromQuery(items, useSearchParams().get("m"));
  // Sin key: al tocar la selección se reescribe la URL y no hay que remontar (perdería "solo diferencias").
  return <Table items={items} initial={initial} />;
}

/** Filas = unión de las etiquetas de la ficha técnica, en el orden en que aparecen. */
function Table({ items, initial }: { items: CompareItem[]; initial: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [onlyDiff, setOnlyDiff] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("m") === selected.join(",")) return;
    url.searchParams.set("m", selected.join(","));
    window.history.replaceState(window.history.state, "", url);
  }, [selected]);

  // En el orden de la categoría, no en el de los clics: así las columnas no saltan.
  const cols = useMemo(() => items.filter((i) => selected.includes(i.slug)), [items, selected]);

  const rows = useMemo<Row[]>(() => {
    const labels: string[] = [];
    for (const c of cols) for (const s of c.specs) if (!labels.includes(s.label)) labels.push(s.label);
    return labels.map((label) => {
      const values = cols.map((c) => c.specs.find((s) => s.label === label)?.value ?? "");
      return { label, values, differs: new Set(values.map(norm)).size > 1 };
    });
  }, [cols]);

  const usesDiffer = new Set(cols.map((c) => [...c.uses].map(norm).sort().join("|"))).size > 1;
  const diffCount = rows.filter((r) => r.differs).length + (usesDiffer ? 1 : 0);
  const shown = onlyDiff ? rows.filter((r) => r.differs) : rows;
  const comparing = cols.length > 1;

  function toggle(slug: string) {
    setSelected((cur) => {
      if (cur.includes(slug)) return cur.length > 1 ? cur.filter((s) => s !== slug) : cur;
      return cur.length < MAX ? [...cur, slug] : cur;
    });
  }

  const n = cols.length;
  // Ancho mínimo por columna: con 2 entra en un celular; con 3 o 4 la tabla se desliza.
  const minWidth = `${n * 9.5}rem`;

  return (
    <section className="container-cb pt-10">
      <fieldset>
        <legend className="eyebrow">Elegí qué comparar · {n} de {Math.min(MAX, items.length)}</legend>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((i) => {
            const on = selected.includes(i.slug);
            const full = !on && selected.length >= MAX;
            return (
              <button
                key={i.slug}
                type="button"
                aria-pressed={on}
                disabled={full}
                onClick={() => toggle(i.slug)}
                className={`group flex items-start gap-3 border p-2.5 text-left transition-colors ${
                  on ? "border-orange bg-orange/10" : "border-white/10 bg-white/[0.03] hover:border-white/25"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center border ${on ? "border-orange bg-orange" : "border-white/30"}`}
                >
                  {on && <span className="h-1.5 w-1.5 rotate-45 bg-ink" />}
                </span>
                <span className="min-w-0">
                  <span className="display block truncate text-sm text-white">{i.model}</span>
                  <span className="line-clamp-2 block text-xs leading-snug text-fog">{i.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.06] py-4">
        <p className="mono text-xs uppercase tracking-[0.16em] text-grey" aria-live="polite">
          {comparing ? (
            diffCount ? (
              <>
                <span className="text-orange">{diffCount}</span> {diffCount === 1 ? "diferencia" : "diferencias"}
              </>
            ) : (
              "Sin diferencias en la ficha técnica"
            )
          ) : (
            "Elegí otro equipo para comparar"
          )}
        </p>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fog">
          <input
            type="checkbox"
            checked={onlyDiff}
            onChange={(e) => setOnlyDiff(e.target.checked)}
            className="h-4 w-4 accent-[var(--cb-orange)]"
          />
          Mostrar solo diferencias
        </label>
      </div>

      {n > 2 && (
        <p className="mono mt-5 flex items-center justify-end gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-grey lg:hidden" aria-hidden>
          Deslizá para ver los {n} <span className="text-orange">→</span>
        </p>
      )}
      <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full table-fixed border-collapse" style={{ minWidth }}>
          <caption className="sr-only">Comparación de {cols.map((c) => c.model).join(", ")}</caption>
          <colgroup>
            <col className="hidden w-52 lg:table-column" />
            {cols.map((c) => (
              <col key={c.slug} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <td className="hidden lg:table-cell" />
              {cols.map((c) => (
                <th key={c.slug} scope="col" className="border-l border-white/[0.06] px-2 pb-5 text-left align-bottom font-normal sm:px-4">
                  <Link href={c.url} className="group block">
                    <div className="aspect-[4/3]">
                      <Machine src={c.image} alt={`Calibra ${c.model}`} sizes="(min-width:1024px) 280px, 45vw" reflection={false} align="center" className="h-full" />
                    </div>
                    <span className="display mt-3 block truncate text-[clamp(1rem,2.4vw,1.5rem)] text-white group-hover:text-orange">
                      {c.model}
                    </span>
                    <span className="mt-0.5 block text-xs text-fog sm:text-sm">{c.title}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="border-t border-white/10">
            {(!onlyDiff || usesDiffer) && cols.some((c) => c.uses.length) && (
              <SpecRow label="Usos" differs={usesDiffer && comparing} n={n}>
                {cols.map((c) => (
                  <td key={c.slug} className="border-l border-white/[0.06] px-2 py-3 align-top sm:px-4">
                    {c.uses.length ? <UseTags uses={c.uses} /> : <Empty />}
                  </td>
                ))}
              </SpecRow>
            )}

            {shown.map((r) => (
              <SpecRow key={r.label} label={r.label} differs={r.differs && comparing} n={n}>
                {r.values.map((v, k) => (
                  <td
                    key={cols[k].slug}
                    className={`mono border-l border-white/[0.06] px-2 py-3 align-top text-sm sm:px-4 ${
                      r.differs && comparing ? "font-semibold text-white" : "text-fog"
                    }`}
                  >
                    {v || <Empty />}
                  </td>
                ))}
              </SpecRow>
            ))}

            {onlyDiff && !shown.length && !usesDiffer && (
              <tr>
                <td colSpan={n + 1} className="py-8 text-center text-fog">
                  Estos equipos tienen la misma ficha técnica.
                </td>
              </tr>
            )}

            {!onlyDiff && (
              <SpecRow label="Características" differs={false} n={n}>
                {cols.map((c) => (
                  <td key={c.slug} className="border-l border-white/[0.06] px-2 py-3 align-top sm:px-4">
                    {c.features.length ? (
                      <ul className="space-y-2 text-sm text-fog">
                        {c.features.map((f) => (
                          <li key={f} className="flex gap-2">
                            <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rotate-45 bg-orange/70" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Empty />
                    )}
                  </td>
                ))}
              </SpecRow>
            )}

            <tr className="border-t border-white/10">
              <td className="hidden lg:table-cell" />
              {cols.map((c) => (
                <td key={c.slug} className="border-l border-white/[0.06] px-2 pt-5 align-top sm:px-4">
                  <div className="flex flex-col items-start gap-2">
                    <a href={c.quoteUrl} target="_blank" rel="noopener" className="btn btn-primary !px-3 !py-2.5 !text-[0.72rem]">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> Cotizar
                    </a>
                    <Link href={c.url} className="mono inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-fog hover:text-white">
                      Ver ficha <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * Una fila de la tabla. En pantallas chicas la etiqueta va en su propia fila
 * arriba de los valores (así entran 2 columnas en un celular); desde lg, a la izquierda.
 */
function SpecRow({ label, differs, n, children }: { label: string; differs: boolean; n: number; children: React.ReactNode }) {
  const tag = (
    <span className="inline-flex items-center gap-2">
      {differs && <span aria-hidden className="h-1.5 w-1.5 shrink-0 rotate-45 bg-orange" />}
      {label}
      {differs && <span className="sr-only">(difiere)</span>}
    </span>
  );
  return (
    <Fragment>
      <tr className="border-t border-white/[0.06] lg:hidden">
        <th colSpan={n} scope="colgroup" className={`px-2 pt-3 text-left text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${differs ? "text-orange" : "text-grey"}`}>
          {tag}
        </th>
      </tr>
      <tr className={`lg:border-t lg:border-white/[0.06] ${differs ? "bg-orange/[0.04]" : ""}`}>
        <th scope="row" className={`hidden px-4 py-3 text-left align-top text-sm font-normal lg:table-cell ${differs ? "text-white" : "text-fog"}`}>
          {tag}
        </th>
        {children}
      </tr>
    </Fragment>
  );
}

function Empty() {
  return <span className="text-grey/60" aria-label="No informado">—</span>;
}

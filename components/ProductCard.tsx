import Link from "next/link";
import type { Product } from "@/lib/data";
import { productUrl } from "@/lib/links";
import { Machine } from "./Machine";

export function ProductCard({ p, categoryTitle }: { p: Product; categoryTitle?: string }) {
  return (
    <Link
      href={productUrl(p)}
      className="corners group relative flex flex-col overflow-hidden border border-white/[0.07] bg-gradient-to-b from-panel to-graphite transition-colors hover:border-white/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden px-6 pt-8">
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse 60% 55% at 50% 30%, rgb(255 255 255 / 0.09), transparent 70%)" }}
        />
        <Machine
          src={p.images[0] ?? ""}
          alt={`Calibra ${p.model}`}
          sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw"
          reflection={false}
          className="h-full transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]"
        />
        {p.badge && (
          <span className="mono absolute left-4 top-4 bg-orange px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink">
            {p.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-white/[0.07] p-5">
        <span className="mono text-[0.68rem] uppercase tracking-[0.2em] text-orange">{categoryTitle ?? p.title}</span>
        <h3 className="display mt-1.5 text-2xl text-white">{p.model}</h3>
        {categoryTitle && <p className="mt-1 text-sm font-medium text-fog">{p.title}</p>}
        {p.heroSpecs.length > 0 && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-dashed border-white/10 pt-4">
            {p.heroSpecs.slice(0, 2).map((s) => (
              <div key={s.label}>
                <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-grey">{s.label}</dt>
                <dd className="mono text-sm font-semibold text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Link>
  );
}

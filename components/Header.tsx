import Image from "next/image";
import Link from "next/link";
import type { Category, Site } from "@/lib/data";
import { whatsappUrl } from "@/lib/links";
import { ArrowUpRight, WhatsAppIcon } from "./Icons";

export function Header({ categories, site }: { categories: Category[]; site: Site }) {
  const quote = whatsappUrl(site.whatsapp, "Hola, quiero cotizar equipos Calibra.");
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/75 backdrop-blur-xl">
      <div className="container-cb flex h-16 items-center gap-6">
        <Link href="/" className="shrink-0" aria-label="Calibra — inicio">
          <Image src="/brand/calibra-logo.png" alt="Calibra" width={1600} height={208} priority className="h-4 w-auto sm:h-[18px]" />
        </Link>

        <nav aria-label="Categorías" className="hidden flex-1 items-center gap-7 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="mono text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-fog transition-colors hover:text-white"
            >
              {c.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={site.launchUrl}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-fog transition-colors hover:text-white lg:inline-flex"
          >
            Launch Uruguay <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a href={quote} target="_blank" rel="noopener" className="btn btn-primary !px-4 !py-2.5 !text-[0.72rem]">
            <WhatsAppIcon className="h-4 w-4" /> Cotizar
          </a>
        </div>
      </div>

      {/* Mobile: categorías en una fila deslizable. */}
      <nav aria-label="Categorías" className="border-t border-white/[0.06] md:hidden">
        <div className="container-cb flex gap-5 overflow-x-auto py-2.5 [scrollbar-width:none]">
          {categories.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="mono shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-fog">
              {c.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

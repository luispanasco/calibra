import Image from "next/image";
import Link from "next/link";
import type { Category, Site } from "@/lib/data";
import { whatsappUrl } from "@/lib/links";
import { ArrowUpRight, WhatsAppIcon } from "./Icons";
import { LaunchWordmark } from "./LaunchWordmark";

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
          <Link
            href="/contacto"
            className="mono border-l border-white/10 pl-7 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-fog transition-colors hover:text-white"
          >
            Contacto
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={site.launchUrl}
            target="_blank"
            rel="noopener"
            className="group hidden items-center gap-2 border border-launch/40 bg-launch/[0.07] px-3.5 py-2 shadow-[0_0_24px_-8px_rgb(223_29_48/0.6)] transition-colors hover:border-launch hover:bg-launch/15 lg:inline-flex"
          >
            <LaunchWordmark className="text-lg" />
            <ArrowUpRight className="h-4 w-4 text-launch transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
          <Link href="/contacto" className="mono shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-fog">
            Contacto
          </Link>
          <a href={site.launchUrl} target="_blank" rel="noopener" className="ml-auto shrink-0 border-l border-white/10 pl-5">
            <LaunchWordmark className="text-sm" />
          </a>
        </div>
      </nav>
    </header>
  );
}

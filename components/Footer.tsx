import Image from "next/image";
import Link from "next/link";
import type { Category, Site } from "@/lib/data";
import { whatsappUrl } from "@/lib/links";
import { ArrowUpRight, WhatsAppIcon } from "./Icons";

export function Footer({ categories, site }: { categories: Category[]; site: Site }) {
  const phone = site.whatsapp.replace(/^598/, "0");
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-graphite">
      <div className="ruler absolute inset-x-0 top-0 opacity-40" aria-hidden />
      <div className="container-cb grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/brand/calibra-logo-c.png" alt="Calibra" width={1600} height={529} className="h-12 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-fog">
            Elevadores, desmontadoras y balanceadoras para talleres, gomerías y flotas. Equipos pesados, medidos al detalle.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Equipos</h2>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-sm text-fog transition-colors hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Contacto</h2>
          <a
            href={whatsappUrl(site.whatsapp, "Hola, quiero consultar por equipos Calibra.")}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-2 text-sm text-white hover:text-orange"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25d366]" /> {phone}
          </a>
          <div className="mt-8 border border-white/10 p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-grey">También de nuestro equipo</p>
            <a
              href={site.launchUrl}
              target="_blank"
              rel="noopener"
              className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-white hover:text-orange"
            >
              Launch Uruguay <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-1 text-xs text-fog">Scanners, diagnóstico y equipamiento automotriz.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-cb flex flex-wrap justify-between gap-2 py-5 text-xs text-grey">
          <span>© {new Date().getFullYear()} Calibra</span>
          <span className="mono uppercase tracking-[0.2em]">Fuerza · Precisión · Taller</span>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/Icons";
import { getSite } from "@/lib/data";
import { DEFAULT_MESSAGE, EMAIL, LOCATIONS, formatPhone, intlPhone } from "@/lib/contacts";
import { whatsappUrl } from "@/lib/links";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Locales y vendedores de Calibra en Montevideo. Consultas de venta y servicio técnico de elevadores, desenllantadoras y balanceadoras por WhatsApp.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactPage() {
  const site = await getSite();
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-50" />
        <div
          aria-hidden
          className="lights-on absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 55% 70% at 85% 0%, rgb(255 255 255 / 0.09), transparent 70%), radial-gradient(ellipse 40% 50% at 0% 100%, rgb(248 119 47 / 0.12), transparent 70%)" }}
        />
        <div className="container-cb py-16 sm:py-24">
          <p className="eyebrow">Hablemos</p>
          <h1 className="display metal mt-4 text-[clamp(3rem,10vw,7.5rem)]">Contacto</h1>
          <p className="mt-5 max-w-xl text-lg text-fog">
            Te asesoramos para elegir el equipo, con la instalación y con el servicio técnico. Escribile por WhatsApp a
            cualquiera del equipo o vení a uno de nuestros locales en Montevideo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappUrl(site.whatsapp, DEFAULT_MESSAGE)} target="_blank" rel="noopener" className="btn btn-primary">
              <WhatsAppIcon className="h-4 w-4" /> Escribinos por WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="btn btn-ghost">
              {EMAIL}
            </a>
          </div>
        </div>
        <div className="ruler absolute inset-x-0 bottom-0 opacity-40" aria-hidden />
      </section>

      <div className="container-cb grid items-start gap-6 pt-14 lg:grid-cols-2">
        {LOCATIONS.map((loc, n) => (
          <section
            key={loc.slug}
            aria-labelledby={`loc-${loc.slug}`}
            className="reveal border border-white/[0.08] bg-gradient-to-b from-panel to-graphite"
          >
            <div className="relative border-b border-white/[0.08] p-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-orange" />
              <span className="display outline-text absolute right-4 top-2 text-6xl leading-none" aria-hidden>
                0{n + 1}
              </span>
              <h2 id={`loc-${loc.slug}`} className="display text-3xl text-white">
                {loc.name}
              </h2>
              <p className="mt-2 text-fog">{loc.address}</p>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener"
                className="mono mt-3 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-orange hover:text-white"
              >
                Cómo llegar →
              </a>
            </div>

            <div className="corners relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.08] bg-ink">
              <iframe
                src={loc.embedUrl}
                title={`Mapa: ${loc.name}, ${loc.address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {loc.sellers.map((s) => (
                <li key={s.phone} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{s.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {s.roles.map((r) => (
                        <span key={r} className="mono border border-white/10 px-1.5 py-0.5 text-[0.62rem] uppercase tracking-[0.14em] text-fog">
                          {r}
                        </span>
                      ))}
                      <span className="mono select-all text-sm tabular-nums text-grey">{formatPhone(s.phone)}</span>
                    </div>
                  </div>
                  <a
                    href={whatsappUrl(intlPhone(s.phone), DEFAULT_MESSAGE)}
                    target="_blank"
                    rel="noopener"
                    aria-label={`WhatsApp a ${s.name} (abre en una pestaña nueva)`}
                    className="btn btn-ghost !px-4 !py-2.5 !text-[0.72rem] hover:!bg-orange hover:!text-ink"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </li>
              ))}
            </ul>

          </section>
        ))}
      </div>
    </>
  );
}

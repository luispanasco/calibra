import type { Metadata, Viewport } from "next";
import { Barlow, Saira, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CompareAnnouncement } from "@/components/CompareAnnouncement";
import { getCategories, getSite } from "@/lib/data";
import { SITE_URL } from "@/lib/links";

const saira = Saira({ variable: "--font-saira", subsets: ["latin"], axes: ["wdth"] });
// Tipografía de Launch Uruguay, solo para su wordmark en las referencias cruzadas.
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400", "700"] });
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Calibra | Elevadores, desenllantadoras y balanceadoras para el taller",
    template: "%s | Calibra",
  },
  description:
    "Maquinaria pesada y precisa para el taller: elevadores tijera, desenllantadoras de neumáticos y balanceadoras Calibra, para auto y camión.",
  openGraph: { siteName: "Calibra", locale: "es_UY", type: "website", images: ["/brand/calibra-logo-c.png"] },
};

export const viewport: Viewport = { themeColor: "#0a0b0d" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, site] = await Promise.all([getCategories(), getSite()]);
  return (
    <html lang="es-UY" className={`${saira.variable} ${barlow.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-orange focus:px-3 focus:py-2 focus:text-ink"
        >
          Saltar al contenido
        </a>
        <Header categories={categories} site={site} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer categories={categories} site={site} />
        <WhatsAppFab phone={site.whatsapp} />
        <CompareAnnouncement categories={categories.map((c) => ({ slug: c.slug, title: c.title }))} />
      </body>
    </html>
  );
}

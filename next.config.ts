import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  images: {
    // Cada foto optimizada queda 31 días en la caché de Vercel. Las fotos de
    // Supabase no traen Cache-Control, así que sin esto se usaban 60 s y el
    // optimizador volvía a bajar el original de Supabase a cada rato (eso agotó
    // la cuota de transferencia el 2026-11-23). Las fotos nunca se pisan: cada
    // subida lleva un nombre nuevo, así que no hay riesgo de mostrar una vieja.
    minimumCacheTTL: 2678400,
    // Fotos en el bucket público `web-images` de Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    return {
      // Slugs viejos (modelo de fábrica, sin el prefijo "sca" del código Nami) →
      // route handler que responde un 308 real. Desde la página el redirect de un
      // slug no prerenderizado sale como 200 + salto por JS, que no le sirve a Google.
      beforeFiles: [
        {
          source: "/:categoria((?!go$|api$|redir$|_next$)[a-z-]+)/:slug((?!sca|comparar$)[a-z0-9-]+)",
          destination: "/redir/:categoria/:slug",
        },
      ],
    };
  },
};

export default nextConfig;

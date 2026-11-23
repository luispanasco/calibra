import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  images: {
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

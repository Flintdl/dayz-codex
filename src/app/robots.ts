import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Site é guia pessoal/comunitário — não queremos indexação Google até
        // resolver questões de conteúdo. Inverta se quiser SEO público.
        disallow: "/",
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

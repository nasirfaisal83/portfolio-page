import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { projects } from "@/content/projects";

// Required for static export (output: "export")
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString();
  return [
    { url: absoluteUrl("/"), lastModified: lastmod, priority: 1.0 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: lastmod,
      priority: 0.8,
    })),
  ];
}

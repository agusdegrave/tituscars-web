import type { MetadataRoute } from "next";
import { getAutosParaSitemap } from "@/lib/autos";
import { SITE_URL } from "@/lib/config";

const PAGINAS_ESTATICAS: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/autos", changeFrequency: "hourly", priority: 0.9 },
  { path: "/consigna", changeFrequency: "monthly", priority: 0.6 },
  { path: "/vende-tu-auto", changeFrequency: "monthly", priority: 0.6 },
  { path: "/financiacion", changeFrequency: "monthly", priority: 0.5 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const autos = await getAutosParaSitemap();

  const estaticas: MetadataRoute.Sitemap = PAGINAS_ESTATICAS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const fichas: MetadataRoute.Sitemap = autos.map((a) => ({
    url: `${SITE_URL}/autos/${a.slug}`,
    lastModified: new Date(a.actualizado_en),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...estaticas, ...fichas];
}

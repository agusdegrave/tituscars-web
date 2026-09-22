import { Hero } from "@/components/hero";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { BeneficiosBanner } from "@/components/beneficios-banner";
import { AccesosBlock } from "@/components/accesos-block";
import { AutoGrid } from "@/components/auto-grid";
import { JsonLd } from "@/components/json-ld";
import {
  getAnios,
  getDestacados,
  getMarcaModeloPairs,
  getUltimosIngresos,
} from "@/lib/autos";
import {
  SITE_URL,
  DIRECCION_CALLE,
  DIRECCION_LOCALIDAD,
  TELEFONO_DISPLAY,
  HORARIOS_SCHEMA,
} from "@/lib/config";

export const revalidate = 60;

export default async function HomePage() {
  const [destacados, ultimosIngresos, pares, anios] = await Promise.all([
    getDestacados(8),
    getUltimosIngresos(12),
    getMarcaModeloPairs(),
    getAnios(),
  ]);

  const nombreSitio = process.env.NEXT_PUBLIC_SITE_NAME ?? "Titus Cars";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: nombreSitio,
    url: SITE_URL,
    telephone: TELEFONO_DISPLAY,
    address: {
      "@type": "PostalAddress",
      streetAddress: DIRECCION_CALLE,
      addressLocality: DIRECCION_LOCALIDAD,
      addressCountry: "AR",
    },
    openingHoursSpecification: HORARIOS_SCHEMA.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero pares={pares} anios={anios} />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">Destacados</h2>
        <div className="mt-6">
          <FeaturedCarousel autos={destacados} />
        </div>
      </section>

      <BeneficiosBanner />

      <AccesosBlock />

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-2xl font-bold tracking-tight">Últimos ingresos</h2>
        <div className="mt-6">
          <AutoGrid autos={ultimosIngresos} />
        </div>
      </section>
    </>
  );
}

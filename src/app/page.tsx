import { Hero } from "@/components/hero";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { AccesosBlock } from "@/components/accesos-block";
import { AutoGrid } from "@/components/auto-grid";
import {
  getAnios,
  getDestacados,
  getMarcaModeloPairs,
  getUltimosIngresos,
} from "@/lib/autos";

export const revalidate = 60;

export default async function HomePage() {
  const [destacados, ultimosIngresos, pares, anios] = await Promise.all([
    getDestacados(8),
    getUltimosIngresos(12),
    getMarcaModeloPairs(),
    getAnios(),
  ]);

  return (
    <>
      <Hero pares={pares} anios={anios} />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">Destacados</h2>
        <div className="mt-6">
          <FeaturedCarousel autos={destacados} />
        </div>
      </section>

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

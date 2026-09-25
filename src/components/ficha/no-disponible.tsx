import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AutoGrid } from "@/components/auto-grid";
import { getSimilaresParaSlug } from "@/lib/autos";

/**
 * "Este auto ya no está disponible" + autos parecidos (misma marca/modelo que
 * el slug pedido), para no perder al que llega a un auto vendido.
 */
export async function FichaNoDisponible({ slug }: { slug: string }) {
  const similares = await getSimilaresParaSlug(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <h1 className="text-2xl font-bold tracking-tight">Este auto ya no está disponible</h1>
        <p className="mt-3 text-muted-foreground">
          Seguramente ya encontró dueño. Mirá los que tenemos ahora.
        </p>
        <Button size="lg" className="mt-6" render={<Link href="/autos" />} nativeButton={false}>
          Ver catálogo
        </Button>
      </div>

      {similares.length > 0 && (
        <div className="mt-14">
          <h2 className="text-center text-lg font-bold md:text-left">Te pueden interesar</h2>
          <div className="mt-4">
            <AutoGrid autos={similares} />
          </div>
        </div>
      )}
    </div>
  );
}

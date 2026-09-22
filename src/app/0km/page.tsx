import { AutoGrid } from "@/components/auto-grid";
import { getAutosFiltrados } from "@/lib/autos";

export const revalidate = 60;

export default async function CeroKmPage() {
  const autos = await getAutosFiltrados({ condicion: "0km" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">0 KM</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Unidades nuevas disponibles
      </p>
      <div className="mt-6">
        <AutoGrid autos={autos} mensajeVacio="Pronto más unidades." />
      </div>
    </div>
  );
}

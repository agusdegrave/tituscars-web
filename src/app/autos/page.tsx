import { AutoGrid } from "@/components/auto-grid";
import { getAutosFiltrados } from "@/lib/autos";

export const revalidate = 60;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string; modelo?: string; anio?: string }>;
}) {
  const { marca, modelo, anio } = await searchParams;
  const autos = await getAutosFiltrados({ marca, modelo, anio });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Catálogo</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {autos.length} {autos.length === 1 ? "auto encontrado" : "autos encontrados"}
      </p>
      <div className="mt-6">
        <AutoGrid autos={autos} />
      </div>
    </div>
  );
}

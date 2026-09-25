"use client";

import { useRouter } from "next/navigation";
import { BusquedaInput } from "@/components/catalogo/filtros-panel";
import { filtrosAParams, type Filtros } from "@/lib/filtros";

/** Buscador del catálogo en celu: mismo input, param y debounce que en compu. */
export function BuscadorCelu({ filtros }: { filtros: Filtros }) {
  const router = useRouter();

  return (
    <BusquedaInput
      id="filtro-busqueda-celu"
      key={filtros.q ?? ""}
      valorInicial={filtros.q ?? ""}
      onBuscar={(valor) => {
        const params = filtrosAParams({ ...filtros, q: valor || undefined, page: 1 });
        router.push(`/autos${params.size > 0 ? `?${params.toString()}` : ""}`);
      }}
    />
  );
}

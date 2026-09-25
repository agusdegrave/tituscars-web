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
      sinLabel
      placeholder="Buscar marca, modelo o versión"
      // Blanco y con el mismo borde/radio/alto que "Filtros" y "Ordenar por",
      // para que no se pierda sobre el fondo gris del catálogo.
      inputClassName="h-10 rounded-lg border-border bg-white"
      onBuscar={(valor) => {
        const params = filtrosAParams({ ...filtros, q: valor || undefined, page: 1 });
        router.push(`/autos${params.size > 0 ? `?${params.toString()}` : ""}`);
      }}
    />
  );
}

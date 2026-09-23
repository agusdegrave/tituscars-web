"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { FiltrosPanel } from "@/components/catalogo/filtros-panel";
import { contarFiltrosActivos, type Filtros } from "@/lib/filtros";
import type { FacetMarca } from "@/lib/facets";

export function FiltrosDrawer({
  filtros,
  marcas,
  anios,
  hayTransmision,
  hayCarroceria,
}: {
  filtros: Filtros;
  marcas: FacetMarca[];
  anios: number[];
  hayTransmision: boolean;
  hayCarroceria: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const cantidadActivos = contarFiltrosActivos(filtros);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <Button
        variant="outline"
        className="h-10 w-full justify-center gap-2 lg:hidden"
        onClick={() => setAbierto(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros{cantidadActivos > 0 ? ` (${cantidadActivos})` : ""}
      </Button>

      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
          <FiltrosPanel
            filtros={filtros}
            marcas={marcas}
            anios={anios}
            hayTransmision={hayTransmision}
            hayCarroceria={hayCarroceria}
          />
        </div>

        <SheetFooter>
          <Button onClick={() => setAbierto(false)} size="lg">
            Ver resultados
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

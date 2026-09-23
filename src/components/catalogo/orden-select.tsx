"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { filtrosAParams, ORDEN_DEFECTO, OPCIONES_ORDEN, type Filtros } from "@/lib/filtros";

const ITEMS = Object.fromEntries(OPCIONES_ORDEN.map((o) => [o.value, o.label]));

export function OrdenSelect({
  filtros,
  className,
}: {
  filtros: Filtros;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Select
      items={ITEMS}
      value={filtros.orden}
      onValueChange={(v) => {
        const orden = v ?? ORDEN_DEFECTO;
        const params = filtrosAParams({ ...filtros, orden, page: 1 });
        router.push(`/autos${params.size > 0 ? `?${params.toString()}` : ""}`);
      }}
    >
      <SelectTrigger className={cn("w-fit", className)}>
        {/* Con el orden por defecto no se muestra "Más recientes", sino la invitación a ordenar. */}
        <SelectValue>
          {(valor: string) =>
            valor === ORDEN_DEFECTO ? "Ordenar por" : (ITEMS[valor] ?? "Ordenar por")
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {OPCIONES_ORDEN.map((op) => (
          <SelectItem key={op.value} value={op.value}>
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

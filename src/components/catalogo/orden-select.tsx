"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filtrosAParams, ORDEN_DEFECTO, OPCIONES_ORDEN, type Filtros } from "@/lib/filtros";

const ITEMS = Object.fromEntries(OPCIONES_ORDEN.map((o) => [o.value, o.label]));

export function OrdenSelect({ filtros }: { filtros: Filtros }) {
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
      <SelectTrigger className="w-fit">
        <SelectValue />
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

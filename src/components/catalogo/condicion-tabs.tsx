"use client";

import { useRouter } from "next/navigation";
import { filtrosAParams, type Filtros } from "@/lib/filtros";
import type { Condicion } from "@/lib/types";

const OPCIONES: { value: Condicion | undefined; label: string }[] = [
  { value: undefined, label: "Todos" },
  { value: "usado", label: "Usados" },
  { value: "0km", label: "0 KM" },
];

export function CondicionTabs({ filtros }: { filtros: Filtros }) {
  const router = useRouter();

  return (
    <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-[3px]">
      {OPCIONES.map((op) => {
        const activo = filtros.condicion === op.value;
        return (
          <button
            key={op.label}
            type="button"
            onClick={() => {
              const params = filtrosAParams({ ...filtros, condicion: op.value, page: 1 });
              router.push(`/autos${params.size > 0 ? `?${params.toString()}` : ""}`);
            }}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              activo
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}

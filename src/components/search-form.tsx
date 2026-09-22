"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TODAS = "__todas__";
const TODOS = "__todos__";

export function SearchForm({
  pares,
  anios,
}: {
  pares: { marca: string; modelo: string }[];
  anios: number[];
}) {
  const router = useRouter();
  const [marca, setMarca] = useState<string>(TODAS);
  const [modelo, setModelo] = useState<string>(TODOS);
  const [anio, setAnio] = useState<string>(TODOS);

  const marcas = useMemo(
    () => Array.from(new Set(pares.map((p) => p.marca))).sort((a, b) => a.localeCompare(b)),
    [pares]
  );

  const modelos = useMemo(() => {
    const filtrados = marca === TODAS ? pares : pares.filter((p) => p.marca === marca);
    return Array.from(new Set(filtrados.map((p) => p.modelo))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [pares, marca]);

  const itemsMarca = useMemo(() => {
    const items: Record<string, string> = { [TODAS]: "Todas las marcas" };
    for (const m of marcas) items[m] = m;
    return items;
  }, [marcas]);

  const itemsModelo = useMemo(() => {
    const items: Record<string, string> = { [TODOS]: "Todos los modelos" };
    for (const m of modelos) items[m] = m;
    return items;
  }, [modelos]);

  const itemsAnio = useMemo(() => {
    const items: Record<string, string> = { [TODOS]: "Todos los años" };
    for (const a of anios) items[String(a)] = String(a);
    return items;
  }, [anios]);

  function handleMarcaChange(valor: string | null) {
    setMarca(valor ?? TODAS);
    setModelo(TODOS);
  }

  function handleModeloChange(valor: string | null) {
    setModelo(valor ?? TODOS);
  }

  function handleAnioChange(valor: string | null) {
    setAnio(valor ?? TODOS);
  }

  function buscar() {
    const params = new URLSearchParams();
    if (marca !== TODAS) params.set("marca", marca);
    if (modelo !== TODOS) params.set("modelo", modelo);
    if (anio !== TODOS) params.set("anio", anio);
    router.push(`/autos${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 text-foreground shadow-lg sm:grid-cols-4 sm:gap-2">
      <Select items={itemsMarca} value={marca} onValueChange={handleMarcaChange}>
        <SelectTrigger className="w-full sm:h-11">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODAS}>Todas las marcas</SelectItem>
          {marcas.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select items={itemsModelo} value={modelo} onValueChange={handleModeloChange}>
        <SelectTrigger className="w-full sm:h-11">
          <SelectValue placeholder="Modelo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos los modelos</SelectItem>
          {modelos.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select items={itemsAnio} value={anio} onValueChange={handleAnioChange}>
        <SelectTrigger className="w-full sm:h-11">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos los años</SelectItem>
          {anios.map((a) => (
            <SelectItem key={a} value={String(a)}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={buscar} size="lg" className="h-11 sm:h-auto">
        Buscar
      </Button>
    </div>
  );
}

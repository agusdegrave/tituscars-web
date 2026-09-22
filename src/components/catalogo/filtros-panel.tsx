"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMiles, parseMiles } from "@/lib/format";
import { filtrosAParams, toggleEnArray, type Filtros } from "@/lib/filtros";
import { modelosParaMarcas, type FacetMarca } from "@/lib/facets";

const COMBUSTIBLES = ["Nafta", "Diesel", "GNC", "Híbrido"];
const TRANSMISIONES: { value: string; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "automatica", label: "Automática" },
];
const CARROCERIAS: { value: string; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "camioneta", label: "Camioneta" },
  { value: "suv", label: "SUV" },
  { value: "utilitario", label: "Utilitario" },
  { value: "moto", label: "Moto" },
];
const KM_OPCIONES = [50000, 100000, 150000, 200000];
const PRECIO_PRESETS = [
  { label: "Hasta 15M", min: undefined, max: 15_000_000 },
  { label: "15M a 25M", min: 15_000_000, max: 25_000_000 },
  { label: "25M a 40M", min: 25_000_000, max: 40_000_000 },
  { label: "Más de 40M", min: 40_000_000, max: undefined },
];
const TODOS = "__todos__";

function BusquedaInput({
  valorInicial,
  onBuscar,
}: {
  valorInicial: string;
  onBuscar: (valor: string) => void;
}) {
  const [busqueda, setBusqueda] = useState(valorInicial);

  useEffect(() => {
    if (busqueda === valorInicial) return;
    const timeout = setTimeout(() => onBuscar(busqueda), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  return (
    <div>
      <Label htmlFor="filtro-busqueda" className="mb-1.5 text-xs text-muted-foreground">
        Buscar
      </Label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="filtro-busqueda"
          placeholder="Marca, modelo o versión"
          className="h-9 pl-8"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
    </div>
  );
}

export function FiltrosPanel({
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
  const router = useRouter();

  function ir(nuevo: Filtros) {
    const params = filtrosAParams({ ...nuevo, page: 1 });
    router.push(`/autos${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  const modelosDisponibles = modelosParaMarcas(marcas, filtros.marca);
  const anioMinValue = filtros.anioMin ? String(filtros.anioMin) : TODOS;
  const anioMaxValue = filtros.anioMax ? String(filtros.anioMax) : TODOS;

  const itemsAnioDesde: Record<string, string> = { [TODOS]: "Desde" };
  const itemsAnioHasta: Record<string, string> = { [TODOS]: "Hasta" };
  for (const a of anios) {
    itemsAnioDesde[String(a)] = String(a);
    itemsAnioHasta[String(a)] = String(a);
  }

  const itemsKm: Record<string, string> = { [TODOS]: "Cualquiera" };
  for (const km of KM_OPCIONES) itemsKm[String(km)] = `Hasta ${formatMiles(km)} km`;

  return (
    <div className="flex flex-col gap-6 text-sm">
      <BusquedaInput
        key={filtros.q ?? ""}
        valorInicial={filtros.q ?? ""}
        onBuscar={(valor) => ir({ ...filtros, q: valor || undefined })}
      />

      {marcas.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Marca
          </legend>
          <div className="flex flex-col gap-2">
            {marcas.map((m) => (
              <label key={m.marca} className="flex items-center gap-2">
                <Checkbox
                  checked={filtros.marca.includes(m.marca)}
                  onCheckedChange={() =>
                    ir({ ...filtros, marca: toggleEnArray(filtros.marca, m.marca) })
                  }
                />
                {m.marca} ({m.cantidad})
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {filtros.marca.length > 0 && modelosDisponibles.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Modelo
          </legend>
          <div className="flex flex-col gap-2">
            {modelosDisponibles.map((m) => (
              <label key={m.modelo} className="flex items-center gap-2">
                <Checkbox
                  checked={filtros.modelo.includes(m.modelo)}
                  onCheckedChange={() =>
                    ir({ ...filtros, modelo: toggleEnArray(filtros.modelo, m.modelo) })
                  }
                />
                {m.modelo} ({m.cantidad})
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {anios.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Año
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <Select
              items={itemsAnioDesde}
              value={anioMinValue}
              onValueChange={(v) =>
                ir({ ...filtros, anioMin: v && v !== TODOS ? Number(v) : undefined })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Desde" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Desde</SelectItem>
                {anios.map((a) => (
                  <SelectItem key={a} value={String(a)}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={itemsAnioHasta}
              value={anioMaxValue}
              onValueChange={(v) =>
                ir({ ...filtros, anioMax: v && v !== TODOS ? Number(v) : undefined })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Hasta</SelectItem>
                {anios.map((a) => (
                  <SelectItem key={a} value={String(a)}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Precio (ARS)
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            inputMode="numeric"
            placeholder="Mínimo"
            className="h-9"
            value={filtros.precioMin ? formatMiles(filtros.precioMin) : ""}
            onChange={(e) => ir({ ...filtros, precioMin: parseMiles(e.target.value) })}
          />
          <Input
            inputMode="numeric"
            placeholder="Máximo"
            className="h-9"
            value={filtros.precioMax ? formatMiles(filtros.precioMax) : ""}
            onChange={(e) => ir({ ...filtros, precioMax: parseMiles(e.target.value) })}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRECIO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                ir({ ...filtros, precioMin: preset.min, precioMax: preset.max })
              }
              className="rounded-full border border-border px-2.5 py-1 text-xs hover:border-primary hover:text-primary"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Kilómetros
        </legend>
        <Select
          items={itemsKm}
          value={filtros.kmMax ? String(filtros.kmMax) : TODOS}
          onValueChange={(v) =>
            ir({ ...filtros, kmMax: v && v !== TODOS ? Number(v) : undefined })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Cualquiera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Cualquiera</SelectItem>
            {KM_OPCIONES.map((km) => (
              <SelectItem key={km} value={String(km)}>
                Hasta {formatMiles(km)} km
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Combustible
        </legend>
        <div className="flex flex-col gap-2">
          {COMBUSTIBLES.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <Checkbox
                checked={filtros.combustible.includes(c)}
                onCheckedChange={() =>
                  ir({ ...filtros, combustible: toggleEnArray(filtros.combustible, c) })
                }
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      {hayTransmision && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Transmisión
          </legend>
          <div className="flex flex-col gap-2">
            {TRANSMISIONES.map((t) => (
              <label key={t.value} className="flex items-center gap-2">
                <Checkbox
                  checked={filtros.transmision.includes(t.value)}
                  onCheckedChange={() =>
                    ir({
                      ...filtros,
                      transmision: toggleEnArray(filtros.transmision, t.value),
                    })
                  }
                />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {hayCarroceria && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Carrocería
          </legend>
          <div className="flex flex-col gap-2">
            {CARROCERIAS.map((c) => (
              <label key={c.value} className="flex items-center gap-2">
                <Checkbox
                  checked={filtros.carroceria.includes(c.value)}
                  onCheckedChange={() =>
                    ir({
                      ...filtros,
                      carroceria: toggleEnArray(filtros.carroceria, c.value),
                    })
                  }
                />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ocultar señados
        </span>
        <Switch
          checked={filtros.sinSenados}
          onCheckedChange={(checked) => ir({ ...filtros, sinSenados: checked })}
        />
      </label>
    </div>
  );
}

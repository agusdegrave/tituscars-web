"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { linkWhatsapp } from "@/lib/whatsapp";
import { formatMiles, parseMiles } from "@/lib/format";

export type Modalidad = "virtual" | "fisica" | "no_se";

export const LABEL_MODALIDAD: Record<Modalidad, string> = {
  virtual: "Virtual",
  fisica: "Física",
  no_se: "No sé todavía",
};

export interface DatosCotizacion {
  marca: string;
  modelo: string;
  anio: string;
  km: string;
  nombre: string;
  telefono: string;
  modalidad: Modalidad | "";
}

const VACIO: DatosCotizacion = {
  marca: "",
  modelo: "",
  anio: "",
  km: "",
  nombre: "",
  telefono: "",
  modalidad: "",
};

const ITEMS_MODALIDAD: Record<string, string> = {
  virtual: LABEL_MODALIDAD.virtual,
  fisica: LABEL_MODALIDAD.fisica,
  no_se: LABEL_MODALIDAD.no_se,
};

export type VarianteCotizacion = "consigna" | "venta";

function construirMensaje(variante: VarianteCotizacion, d: DatosCotizacion): string {
  const partes = [d.marca, d.modelo, d.anio].filter(Boolean).join(" ");
  const km = d.km ? ` con ${formatMiles(d.km)} km` : "";

  if (variante === "consigna") {
    const modalidad = d.modalidad ? ` Modalidad: ${LABEL_MODALIDAD[d.modalidad]}.` : "";
    return `Hola! Quiero consignar mi ${partes}${km}.${modalidad} Soy ${d.nombre}.`;
  }

  return `Hola! Quiero vender mi ${partes}${km}. Soy ${d.nombre}.`;
}

export function CotizacionForm({
  storageKey,
  variante,
  textoBoton = "Enviar por WhatsApp",
}: {
  /** Clave propia de sessionStorage: cada página guarda lo suyo por separado. */
  storageKey: string;
  /** "consigna" agrega el select de modalidad; "venta" no. */
  variante: VarianteCotizacion;
  textoBoton?: string;
}) {
  const mostrarModalidad = variante === "consigna";
  const [datos, setDatos] = useState<DatosCotizacion>(VACIO);
  const [cargado, setCargado] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Recupera lo que haya quedado guardado (si el usuario volvió a la página).
  // Va en un efecto (no en el estado inicial) a propósito: leer sessionStorage
  // durante el render rompería la hidratación, porque el servidor siempre
  // arranca vacío y no puede saber qué hay en el navegador de esa visita.
  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (guardado) setDatos({ ...VACIO, ...JSON.parse(guardado) });
    } catch {
      // sessionStorage puede fallar (privado, bloqueado): el form arranca vacío.
    }
    setCargado(true);
  }, [storageKey]);

  // Guarda en cada cambio, recién después de haber leído lo anterior (para no
  // pisar un borrador guardado con el estado vacío del primer render).
  useEffect(() => {
    if (!cargado) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(datos));
    } catch {
      // Nada que hacer: el form sigue funcionando, sólo no persiste.
    }
  }, [datos, cargado, storageKey]);

  function set<K extends keyof DatosCotizacion>(campo: K, valor: DatosCotizacion[K]) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  }

  const valido =
    datos.marca.trim() !== "" &&
    datos.modelo.trim() !== "" &&
    datos.nombre.trim() !== "" &&
    datos.telefono.trim() !== "";

  function enviar() {
    if (!valido) return;
    window.open(linkWhatsapp(construirMensaje(variante, datos)), "_blank", "noopener,noreferrer");
    setEnviado(true);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cot-marca" className="mb-1.5">
            Marca *
          </Label>
          <Input
            id="cot-marca"
            value={datos.marca}
            onChange={(e) => set("marca", e.target.value)}
            placeholder="Fiat"
          />
        </div>
        <div>
          <Label htmlFor="cot-modelo" className="mb-1.5">
            Modelo *
          </Label>
          <Input
            id="cot-modelo"
            value={datos.modelo}
            onChange={(e) => set("modelo", e.target.value)}
            placeholder="Cronos"
          />
        </div>
        <div>
          <Label htmlFor="cot-anio" className="mb-1.5">
            Año
          </Label>
          <Input
            id="cot-anio"
            inputMode="numeric"
            value={datos.anio}
            onChange={(e) => set("anio", e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="2021"
          />
        </div>
        <div>
          <Label htmlFor="cot-km" className="mb-1.5">
            Kilómetros
          </Label>
          <Input
            id="cot-km"
            inputMode="numeric"
            value={formatMiles(datos.km)}
            onChange={(e) => set("km", String(parseMiles(e.target.value) ?? ""))}
            placeholder="80.000"
          />
        </div>
        <div>
          <Label htmlFor="cot-nombre" className="mb-1.5">
            Tu nombre *
          </Label>
          <Input
            id="cot-nombre"
            value={datos.nombre}
            onChange={(e) => set("nombre", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cot-telefono" className="mb-1.5">
            Tu WhatsApp *
          </Label>
          <Input
            id="cot-telefono"
            inputMode="tel"
            value={datos.telefono}
            onChange={(e) => set("telefono", e.target.value)}
            placeholder="351 123 4567"
          />
        </div>

        {mostrarModalidad && (
          <div className="col-span-2">
            <Label className="mb-1.5">¿Cómo preferís consignarlo?</Label>
            <Select
              items={{ "": "Elegí una opción", ...ITEMS_MODALIDAD }}
              value={datos.modalidad}
              onValueChange={(v) => set("modalidad", (v ?? "") as Modalidad | "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegí una opción" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LABEL_MODALIDAD).map(([valor, label]) => (
                  <SelectItem key={valor} value={valor}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 sm:w-fit"
        disabled={!valido}
        onClick={enviar}
      >
        <WhatsappIcon className="h-4 w-4" />
        {textoBoton}
      </Button>

      {enviado && (
        <p className="text-sm text-muted-foreground">
          Se abrió WhatsApp con tu mensaje. Si no se abrió, revisá que el navegador no lo haya bloqueado.
        </p>
      )}
    </div>
  );
}

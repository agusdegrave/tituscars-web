"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { linkWhatsapp } from "@/lib/whatsapp";
import { formatMiles, formatPrecio, parseMiles } from "@/lib/format";

const PRESUPUESTO_MIN = 5_000_000;
const PRESUPUESTO_MAX = 100_000_000;
const PRESUPUESTO_PASO = 500_000;

interface Datos {
  nombre: string;
  celular: string;
  modelos: string;
  entrega: boolean;
  entregaModelo: string;
  entregaAnio: string;
  entregaKm: string;
  financia: boolean;
  contado: boolean;
  /** null = el cliente no tocó la barra (sin presupuesto informado). */
  presupuesto: number | null;
  observaciones: string;
  /** Campo trampa: una persona no lo ve; si viene lleno es un bot. */
  trampa: string;
}

const VACIO: Datos = {
  nombre: "",
  celular: "",
  modelos: "",
  entrega: false,
  entregaModelo: "",
  entregaAnio: "",
  entregaKm: "",
  financia: false,
  contado: false,
  presupuesto: null,
  observaciones: "",
  trampa: "",
};

function textoPresupuesto(valor: number): string {
  return valor >= PRESUPUESTO_MAX ? "Más de $100M" : formatPrecio(valor, "ARS");
}

function anioValido(texto: string): number | null {
  const n = Number(texto);
  return texto && n >= 1950 && n <= 2100 ? n : null;
}

function kmValido(texto: string): number | null {
  const n = Number(texto);
  return texto && n >= 0 && n <= 2_000_000 ? n : null;
}

function construirMensaje(d: Datos, autoTitulo?: string): string {
  const lineas = [`Hola! Soy ${d.nombre.trim()}. Quiero que me busquen un auto a medida.`];
  if (autoTitulo) lineas.push(`Lo pido desde la ficha del ${autoTitulo}.`);
  if (d.modelos.trim()) lineas.push(`Busco: ${d.modelos.trim()}.`);
  if (d.entrega) {
    const entrego = [
      d.entregaModelo.trim(),
      anioValido(d.entregaAnio),
      kmValido(d.entregaKm) !== null ? `${formatMiles(d.entregaKm)} km` : null,
    ]
      .filter(Boolean)
      .join(", ");
    lineas.push(`Entrego vehículo${entrego ? `: ${entrego}` : ""}.`);
  }
  const pago = [d.financia && "financiado", d.contado && "contado"].filter(Boolean).join(" y ");
  if (pago) lineas.push(`Pago: ${pago}.`);
  if (d.presupuesto !== null) lineas.push(`Presupuesto máximo: ${textoPresupuesto(d.presupuesto)}.`);
  if (d.observaciones.trim()) lineas.push(`Observaciones: ${d.observaciones.trim()}`);
  lineas.push(`Mi celular: ${d.celular.trim()}`);
  return lineas.join("\n");
}

export function BusquedaAMedida({
  autoSlug,
  autoTitulo,
  className,
}: {
  /** Si el form está en la ficha de un auto, se guarda de dónde vino el pedido. */
  autoSlug?: string;
  autoTitulo?: string;
  className?: string;
}) {
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  function set<K extends keyof Datos>(campo: K, valor: Datos[K]) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  }

  const valido = datos.nombre.trim().length >= 2 && datos.celular.trim().length >= 6;

  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valido || enviando) return;

    // Bot: se hace como que salió bien, sin guardar ni abrir nada.
    if (datos.trampa) {
      setListo(true);
      return;
    }

    setEnviando(true);
    // La pestaña se abre ya, en el clic: si se abriera después de esperar a la
    // base, el navegador la bloquearía como popup. Cuando termina el insert se
    // la manda a WhatsApp.
    const pestana = window.open("", "_blank");

    const { error } = await supabase.from("busquedas_web").insert({
      nombre: datos.nombre.trim().slice(0, 80),
      celular: datos.celular.trim().slice(0, 30),
      modelos_buscados: datos.modelos.trim().slice(0, 300) || null,
      entrega_vehiculo: datos.entrega,
      entrega_modelo: datos.entrega ? datos.entregaModelo.trim().slice(0, 120) || null : null,
      entrega_anio: datos.entrega ? anioValido(datos.entregaAnio) : null,
      entrega_km: datos.entrega ? kmValido(datos.entregaKm) : null,
      financia: datos.financia,
      contado: datos.contado,
      presupuesto_max: datos.presupuesto,
      observaciones: datos.observaciones.trim().slice(0, 1000) || null,
      pagina: `${window.location.pathname}${window.location.search}`.slice(0, 300),
      auto_slug: autoSlug?.slice(0, 200) ?? null,
    });
    if (error) console.error("busquedas_web insert", error.message);

    // Salga bien o mal el insert, el pedido llega igual por WhatsApp.
    const link = linkWhatsapp(construirMensaje(datos, autoTitulo));
    if (pestana) {
      pestana.opener = null;
      pestana.location.href = link;
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }

    setEnviando(false);
    setListo(true);
  }

  return (
    <section
      className={`rounded-2xl bg-brand-light p-6 sm:p-8 ${className ?? ""}`}
      aria-labelledby="busqueda-a-medida-titulo"
    >
      {listo ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-brand" />
          <p className="text-lg font-bold">
            ¡Listo! Ya recibimos tu búsqueda, te escribimos a la brevedad.
          </p>
        </div>
      ) : (
        <>
          <h2 id="busqueda-a-medida-titulo" className="text-2xl font-black tracking-tight">
            ¿No encontraste el vehículo que buscás?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Te buscamos tu auto a medida. Dejanos tus preferencias y te lo conseguimos. Sin
            costo, sin compromiso.
          </p>

          <form onSubmit={enviar} className="mt-6 space-y-5">
            {/* Honeypot: fuera de pantalla y fuera del tab; sólo lo completa un bot. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="bam-web">No completar</label>
              <input
                id="bam-web"
                name="web"
                tabIndex={-1}
                autoComplete="off"
                value={datos.trampa}
                onChange={(e) => set("trampa", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="bam-nombre" className="mb-1.5">
                  Nombre *
                </Label>
                <Input
                  id="bam-nombre"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  value={datos.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  className="h-10 bg-background"
                />
              </div>
              <div>
                <Label htmlFor="bam-celular" className="mb-1.5">
                  Celular *
                </Label>
                <Input
                  id="bam-celular"
                  required
                  minLength={6}
                  maxLength={30}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="351 123 4567"
                  value={datos.celular}
                  onChange={(e) => set("celular", e.target.value)}
                  className="h-10 bg-background"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bam-modelos" className="mb-1.5">
                Modelos buscados
              </Label>
              <Input
                id="bam-modelos"
                maxLength={300}
                placeholder="Ej.: Toyota Corolla, VW Vento"
                value={datos.modelos}
                onChange={(e) => set("modelos", e.target.value)}
                className="h-10 bg-background"
              />
            </div>

            <div className="space-y-4">
              <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={datos.entrega}
                  onChange={(e) => set("entrega", e.target.checked)}
                  className="size-5 cursor-pointer accent-brand"
                />
                Entrego vehículo
              </label>

              {datos.entrega && (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="bam-entrega-modelo" className="mb-1.5">
                      Modelo
                    </Label>
                    <Input
                      id="bam-entrega-modelo"
                      maxLength={120}
                      placeholder="Ej.: Fiat Cronos 1.3"
                      value={datos.entregaModelo}
                      onChange={(e) => set("entregaModelo", e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bam-entrega-anio" className="mb-1.5">
                      Año
                    </Label>
                    <Input
                      id="bam-entrega-anio"
                      inputMode="numeric"
                      placeholder="2020"
                      value={datos.entregaAnio}
                      onChange={(e) =>
                        set("entregaAnio", e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bam-entrega-km" className="mb-1.5">
                      Km
                    </Label>
                    <Input
                      id="bam-entrega-km"
                      inputMode="numeric"
                      placeholder="80.000"
                      value={formatMiles(datos.entregaKm)}
                      onChange={(e) =>
                        set("entregaKm", String(parseMiles(e.target.value) ?? "").slice(0, 7))
                      }
                      className="h-10"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={datos.financia}
                    onChange={(e) => set("financia", e.target.checked)}
                    className="size-5 cursor-pointer accent-brand"
                  />
                  Financio
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={datos.contado}
                    onChange={(e) => set("contado", e.target.checked)}
                    className="size-5 cursor-pointer accent-brand"
                  />
                  Contado
                </label>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <Label htmlFor="bam-presupuesto">Presupuesto máximo</Label>
                <span className="text-base font-black">
                  {datos.presupuesto === null
                    ? "Mové la barra"
                    : textoPresupuesto(datos.presupuesto)}
                </span>
              </div>
              <input
                id="bam-presupuesto"
                type="range"
                min={PRESUPUESTO_MIN}
                max={PRESUPUESTO_MAX}
                step={PRESUPUESTO_PASO}
                value={datos.presupuesto ?? (PRESUPUESTO_MIN + PRESUPUESTO_MAX) / 2}
                onChange={(e) => set("presupuesto", Number(e.target.value))}
                aria-valuetext={
                  datos.presupuesto === null ? "Sin definir" : textoPresupuesto(datos.presupuesto)
                }
                className="w-full cursor-pointer accent-brand"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>$5M</span>
                <span>Más de $100M</span>
              </div>
            </div>

            <div>
              <Label htmlFor="bam-observaciones" className="mb-1.5">
                Observaciones
              </Label>
              <textarea
                id="bam-observaciones"
                rows={3}
                maxLength={1000}
                placeholder="Color, versión, cantidad de puertas, lo que quieras contarnos"
                value={datos.observaciones}
                onChange={(e) => set("observaciones", e.target.value)}
                className="w-full resize-y rounded-lg border border-input bg-background px-2.5 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!valido || enviando}
              className="h-12 w-full rounded-full text-base sm:w-auto sm:px-10"
            >
              {enviando ? "Enviando…" : "Enviar"}
            </Button>
          </form>
        </>
      )}
    </section>
  );
}

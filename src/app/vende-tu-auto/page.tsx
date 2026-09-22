import type { Metadata } from "next";
import Link from "next/link";
import { HeroOscuro } from "@/components/institucional/hero-oscuro";
import { PasosNumerados } from "@/components/institucional/pasos-numerados";
import { CotizacionForm } from "@/components/institucional/cotizacion-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vendé tu auto | Titus Cars",
  description: "Te compramos tu auto al contado en Córdoba: cotización en el día.",
};

const PASOS = [
  { titulo: "Mandanos los datos", texto: "Contanos qué auto tenés por WhatsApp." },
  { titulo: "Lo vemos en el local", texto: "Coordinamos un turno y lo revisamos juntos." },
  { titulo: "Te pagamos", texto: "Cerramos el precio y te pagamos al contado." },
];

export default function VendeTuAutoPage() {
  return (
    <div>
      <HeroOscuro
        titulo="Te lo compramos hoy"
        subtitulo="Cotización en el día, pago al contado."
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">Cómo funciona</h2>
        <div className="mt-8">
          <PasosNumerados pasos={PASOS} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold">¿Preferís que lo vendamos por vos?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Con la consigna te queda un poco más de precio y no te desprendés del auto
              hasta que se vende.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full shrink-0 sm:w-fit"
            render={<Link href="/consigna" />}
            nativeButton={false}
          >
            Ver consigna
          </Button>
        </div>
      </section>

      <section className="bg-brand-light px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">Pedí tu cotización</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contanos sobre tu auto y te contactamos por WhatsApp.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <CotizacionForm storageKey="form-vende" variante="venta" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold">También lo tomamos como parte de pago</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Elegí tu próximo auto en el catálogo y usá el tuyo como parte del pago.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full shrink-0 sm:w-fit"
            render={<Link href="/autos" />}
            nativeButton={false}
          >
            Ver catálogo
          </Button>
        </div>
      </section>
    </div>
  );
}

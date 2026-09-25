import Image from "next/image";
import Link from "next/link";
import { formatKm, formatPrecio, tituloAuto } from "@/lib/format";
import { PastillaDisponibilidad } from "@/components/pastilla-disponibilidad";
import type { AutoCatalogo } from "@/lib/types";

function lineaDatos(auto: AutoCatalogo): string {
  const partes = [
    String(auto.anio),
    formatKm(auto.km),
    auto.combustible,
    auto.transmision === "manual"
      ? "Manual"
      : auto.transmision === "automatica"
        ? "Automática"
        : null,
  ].filter(Boolean);
  return partes.join(" · ");
}

export function AutoCard({ auto }: { auto: AutoCatalogo }) {
  return (
    <Link
      href={`/autos/${auto.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {auto.foto_principal ? (
          <Image
            src={auto.foto_principal}
            alt={tituloAuto(auto)}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        <div className="absolute right-2 top-2">
          <PastillaDisponibilidad disponibilidad={auto.disponibilidad} chicaDesdeSm />
        </div>

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {auto.estado === "senado" && (
            <span className="rounded-md bg-brand-black px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Señado
            </span>
          )}
          {auto.condicion === "0km" && (
            <span className="rounded-md bg-brand px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              0 KM
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-bold uppercase tracking-tight">
          {tituloAuto(auto)}
        </h3>
        <p className="text-sm text-muted-foreground">{lineaDatos(auto)}</p>
        <p className="mt-auto pt-2 text-xl font-black">
          {formatPrecio(auto.precio, auto.moneda)}
        </p>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { linkWhatsapp } from "@/lib/whatsapp";

export function EstadoVacio({ textoBusqueda }: { textoBusqueda?: string }) {
  const mensaje = `Hola! Estoy buscando un ${textoBusqueda || "auto"} y no lo vi en la web`;

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground" />
      <p className="mt-4 text-base font-medium">No encontramos autos con esos filtros</p>
      <Button
        variant="outline"
        className="mt-4"
        render={<Link href="/autos" />}
        nativeButton={false}
      >
        Limpiar filtros
      </Button>

      <div className="mt-10 max-w-sm rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold">¿Buscás algo puntual?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contanos qué querés y te avisamos cuando ingrese.
        </p>
        <a
          href={linkWhatsapp(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 text-sm font-semibold text-white hover:opacity-90"
        >
          <WhatsappIcon className="h-4 w-4" />
          Escribinos por WhatsApp
        </a>
      </div>
    </div>
  );
}

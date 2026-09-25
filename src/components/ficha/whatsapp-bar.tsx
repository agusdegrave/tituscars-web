"use client";

import { Share2 } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { toast } from "@/components/ui/toast";

async function compartir(titulo: string) {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, url });
    } catch {
      // el usuario canceló el share nativo, no hacemos nada
    }
    return;
  }

  await navigator.clipboard.writeText(url);
  toast.add({ title: "Link copiado" });
}

/**
 * Botones de WhatsApp de la ficha: son <a href> reales con el link ya armado
 * en el servidor, así funcionan aunque el JS del navegador no corra.
 */
export function WhatsappCta({
  titulo,
  precioFormateado,
  hrefWhatsapp,
}: {
  titulo: string;
  precioFormateado: string;
  hrefWhatsapp: string;
}) {
  const handleCompartir = () => compartir(titulo);

  return (
    <>
      <div className="flex gap-2">
        <a
          href={hrefWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          <WhatsappIcon className="h-5 w-5" />
          Consultar por WhatsApp
        </a>
        <button
          type="button"
          onClick={handleCompartir}
          aria-label="Compartir"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
        <span className="text-lg font-black">{precioFormateado}</span>
        <a
          href={hrefWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 flex-1 max-w-[65%] items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white"
        >
          <WhatsappIcon className="h-4 w-4" />
          Consultar
        </a>
      </div>
    </>
  );
}

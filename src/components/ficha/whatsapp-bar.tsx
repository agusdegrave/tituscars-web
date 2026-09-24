"use client";

import { Share2 } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { toast } from "@/components/ui/toast";

// Estilo Mercado Libre: el link va solo en su línea para que WhatsApp arme la
// vista previa con la foto del auto.
function mensajeConsulta(titulo: string, anio: number, datos: string, conCita: boolean) {
  const url =
    typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
  const lineas = [
    "Hola, ¿cómo estás? Me interesó este vehículo:",
    `🚗 ${titulo} ${anio}`,
    datos,
    url,
  ];
  if (conCita) lineas.push("¿Puedo coordinar una cita para verlo?");
  return lineas.join("\n");
}

function abrirWhatsapp(mensaje: string) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP;
  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

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

export function WhatsappCta({
  titulo,
  anio,
  precioFormateado,
  datos,
  conCita,
}: {
  titulo: string;
  anio: number;
  precioFormateado: string;
  /** Línea de datos del mensaje: "127.913 km · Nafta · $ 19.500.000". */
  datos: string;
  conCita: boolean;
}) {
  const handleWhatsapp = () => abrirWhatsapp(mensajeConsulta(titulo, anio, datos, conCita));
  const handleCompartir = () => compartir(titulo);

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleWhatsapp}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          <WhatsappIcon className="h-5 w-5" />
          Consultar por WhatsApp
        </button>
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
        <button
          type="button"
          onClick={handleWhatsapp}
          className="flex h-11 flex-1 max-w-[65%] items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white"
        >
          <WhatsappIcon className="h-4 w-4" />
          Consultar
        </button>
      </div>
    </>
  );
}

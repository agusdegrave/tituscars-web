"use client";

import { useEffect } from "react";
import { track, type DatosEvento, type TipoEvento } from "@/lib/tracking";

/** Dispara un evento una vez al entrar a la página (vista_auto, vista_catalogo). */
export function TrackAlMontar({ tipo, datos }: { tipo: TipoEvento; datos?: DatosEvento }) {
  const clave = JSON.stringify(datos ?? {});
  useEffect(() => {
    track(tipo, JSON.parse(clave) as DatosEvento);
  }, [tipo, clave]);
  return null;
}

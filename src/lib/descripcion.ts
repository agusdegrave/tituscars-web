// Caracteres invisibles que llegan pegados desde WhatsApp/Word:
// word joiner, zero-width space / non-joiner / joiner y BOM.
const INVISIBLES = /[⁠​‌‍﻿]/g;
// "-", "•", "·" y también "*" (hay publicaciones que usan asterisco).
const VINETA = /^[-•·*]\s*/;

/**
 * Separa el texto de publicación que arman en el legajo de gestión en items
 * (líneas con "-", "•", "·" o "*") y cierre (el resto de las líneas con texto).
 * La primera línea con " | " y "KM" es el encabezado con los km exactos: no
 * se muestra nunca (en la web los km van redondeados).
 */
export function parsePublicacion(texto: string | null | undefined): {
  items: string[];
  cierre: string[];
} {
  const lineas = (texto ?? "")
    .replace(INVISIBLES, "")
    .split(/\r?\n/)
    .map((linea) => linea.replace(/\s+/g, " ").trim());

  const primera = lineas.findIndex((linea) => linea !== "");
  if (primera !== -1 && lineas[primera].includes(" | ") && lineas[primera].includes("KM")) {
    lineas.splice(primera, 1);
  }

  const items: string[] = [];
  const cierre: string[] = [];
  for (const linea of lineas) {
    if (VINETA.test(linea)) {
      const item = linea.replace(VINETA, "").trim();
      if (item) items.push(item);
    } else if (linea) {
      cierre.push(linea);
    }
  }
  return { items, cierre };
}

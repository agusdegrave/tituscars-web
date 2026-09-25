/**
 * Búsqueda flexible del catálogo sobre la columna `busqueda` de la vista
 * catalogo_publico: marca + modelo + versión + año, en minúscula, sin acentos
 * y sin nada que no sea a-z0-9 (ej. "volkswagentcrosstrendline16msi110cv2020").
 *
 * Un auto coincide si `busqueda` contiene el texto buscado compactado entero
 * ("t cross" -> "tcross") o si contiene todos sus tokens por separado ("trend
 * gol" también encuentra el Gol Trend).
 */

/** Alias -> como figura en `busqueda`. Para sumar uno, agregarlo acá. */
export const SINONIMOS: Record<string, string> = {
  vw: "volkswagen",
  chevy: "chevrolet",
  mb: "mercedesbenz",
  mercedes: "mercedesbenz",
  citroen: "citroen",
  peugeot: "peugeot",
};

/** Minúscula, sin acentos y todo lo que no sea a-z0-9 pasa a ser espacio. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface Busqueda {
  /** Todo junto, sin espacios: "t cross" -> "tcross". */
  compacto: string;
  /** Tokens para el modo "contiene todos" (sin los de 1 carácter, salvo que sea el único). */
  tokens: string[];
}

export function prepararBusqueda(q: string | null | undefined): Busqueda | null {
  const todos = normalizar(q ?? "")
    .split(" ")
    .filter(Boolean)
    .map((token) => SINONIMOS[token] ?? token);
  if (todos.length === 0) return null;

  const tokens = todos.length === 1 ? todos : todos.filter((t) => t.length > 1);
  return { compacto: todos.join(""), tokens };
}

// Después de normalizar solo quedan a-z0-9, así que % y _ ya no pueden
// llegar; se escapan igual por si cambia la normalización.
function escaparLike(texto: string): string {
  return texto.replace(/[%_\\]/g, (c) => `\\${c}`);
}

/** Filtro para supabase-js `.or(...)`, o null si no hay nada para buscar. */
export function filtroBusqueda(q: string | null | undefined): string | null {
  const busqueda = prepararBusqueda(q);
  if (!busqueda) return null;

  const condiciones = [`busqueda.ilike.%${escaparLike(busqueda.compacto)}%`];
  const soloElCompacto = busqueda.tokens.length === 1 && busqueda.tokens[0] === busqueda.compacto;
  if (busqueda.tokens.length > 0 && !soloElCompacto) {
    const todos = busqueda.tokens.map((t) => `busqueda.ilike.%${escaparLike(t)}%`);
    condiciones.push(todos.length === 1 ? todos[0] : `and(${todos.join(",")})`);
  }
  return condiciones.join(",");
}

/** La misma regla que filtroBusqueda, en JS (para probarla sin la base). */
export function coincide(busquedaAuto: string, q: string | null | undefined): boolean {
  const busqueda = prepararBusqueda(q);
  if (!busqueda) return true;
  if (busquedaAuto.includes(busqueda.compacto)) return true;
  return busqueda.tokens.length > 0 && busqueda.tokens.every((t) => busquedaAuto.includes(t));
}

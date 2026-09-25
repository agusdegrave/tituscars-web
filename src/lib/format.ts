import type { Moneda } from "@/lib/types";

const numeroAR = new Intl.NumberFormat("es-AR");

export function formatPrecio(precio: number, moneda: Moneda): string {
  if (moneda === "USD") {
    return `USD ${numeroAR.format(precio)}`;
  }
  return `$ ${numeroAR.format(precio)}`;
}

/**
 * Km para mostrar (solo visual; filtros y orden usan el valor real): menos de
 * 1000 va exacto, desde 1000 se redondea a miles (120.933 → "121.000 km").
 * Sin km no se muestra nada.
 */
export function formatKm(km: number | null | undefined): string | null {
  if (km === null || km === undefined) return null;
  const redondeado = km < 1000 ? km : Math.round(km / 1000) * 1000;
  return `${numeroAR.format(redondeado)} km`;
}

export function formatMiles(valor: number | string): string {
  const digitos = String(valor).replace(/\D/g, "");
  if (!digitos) return "";
  return numeroAR.format(Number(digitos));
}

export function parseMiles(texto: string): number | undefined {
  const digitos = texto.replace(/\D/g, "");
  return digitos ? Number(digitos) : undefined;
}

export function tituloAuto(a: {
  marca: string;
  modelo: string;
  version?: string | null;
}): string {
  return [a.marca, a.modelo, a.version].filter(Boolean).join(" ").toUpperCase();
}

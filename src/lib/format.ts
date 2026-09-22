import type { Moneda } from "@/lib/types";

const numeroAR = new Intl.NumberFormat("es-AR");

export function formatPrecio(precio: number, moneda: Moneda): string {
  if (moneda === "USD") {
    return `USD ${numeroAR.format(precio)}`;
  }
  return `$ ${numeroAR.format(precio)}`;
}

export function formatKm(km: number): string {
  return `${numeroAR.format(km)} km`;
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

import { supabase } from "@/lib/supabase";
import type { AutoCatalogo, Condicion } from "@/lib/types";

const TABLA = "catalogo_publico";

export interface FiltrosCatalogo {
  marca?: string;
  modelo?: string;
  anio?: string;
  condicion?: Condicion;
}

export async function getDestacados(limite = 8): Promise<AutoCatalogo[]> {
  const { data: destacados } = await supabase
    .from(TABLA)
    .select("*")
    .eq("destacado_web", true)
    .order("fecha_ingreso", { ascending: false })
    .limit(limite);

  if (destacados && destacados.length > 0) {
    return destacados;
  }

  const { data: recientes } = await supabase
    .from(TABLA)
    .select("*")
    .order("fecha_ingreso", { ascending: false })
    .limit(limite);

  return recientes ?? [];
}

export async function getUltimosIngresos(limite = 12): Promise<AutoCatalogo[]> {
  const { data } = await supabase
    .from(TABLA)
    .select("*")
    .order("fecha_ingreso", { ascending: false })
    .limit(limite);

  return data ?? [];
}

export async function getMarcas(): Promise<string[]> {
  const { data } = await supabase.from(TABLA).select("marca");
  const set = new Set((data ?? []).map((r) => r.marca as string));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getModelosPorMarca(marca?: string): Promise<string[]> {
  let query = supabase.from(TABLA).select("modelo");
  if (marca) {
    query = query.eq("marca", marca);
  }
  const { data } = await query;
  const set = new Set((data ?? []).map((r) => r.modelo as string));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getMarcaModeloPairs(): Promise<
  { marca: string; modelo: string }[]
> {
  const { data } = await supabase.from(TABLA).select("marca, modelo");
  const vistos = new Set<string>();
  const pares: { marca: string; modelo: string }[] = [];

  for (const fila of data ?? []) {
    const marca = fila.marca as string;
    const modelo = fila.modelo as string;
    const clave = `${marca}::${modelo}`;
    if (!vistos.has(clave)) {
      vistos.add(clave);
      pares.push({ marca, modelo });
    }
  }

  return pares.sort(
    (a, b) => a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo)
  );
}

export async function getAnios(): Promise<number[]> {
  const { data } = await supabase.from(TABLA).select("anio");
  const set = new Set((data ?? []).map((r) => r.anio as number));
  return Array.from(set).sort((a, b) => b - a);
}

export async function getAutosFiltrados(
  filtros: FiltrosCatalogo = {}
): Promise<AutoCatalogo[]> {
  let query = supabase.from(TABLA).select("*");

  if (filtros.marca) query = query.eq("marca", filtros.marca);
  if (filtros.modelo) query = query.eq("modelo", filtros.modelo);
  if (filtros.anio) query = query.eq("anio", Number(filtros.anio));
  if (filtros.condicion) query = query.eq("condicion", filtros.condicion);

  const { data } = await query
    .order("destacado_web", { ascending: false })
    .order("fecha_ingreso", { ascending: false });

  return data ?? [];
}

export async function getAutoPorSlug(slug: string): Promise<AutoCatalogo | null> {
  const { data } = await supabase
    .from(TABLA)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

export async function getSimilares(
  auto: AutoCatalogo,
  limite = 4
): Promise<AutoCatalogo[]> {
  const resultado: AutoCatalogo[] = [];
  const idsUsados = new Set<string>([auto.id]);

  const { data: porMarca } = await supabase
    .from(TABLA)
    .select("*")
    .eq("marca", auto.marca)
    .neq("id", auto.id)
    .order("fecha_ingreso", { ascending: false })
    .limit(limite);

  for (const item of porMarca ?? []) {
    resultado.push(item);
    idsUsados.add(item.id);
  }

  if (resultado.length < limite && auto.carroceria) {
    const { data: porCarroceria } = await supabase
      .from(TABLA)
      .select("*")
      .eq("carroceria", auto.carroceria)
      .neq("id", auto.id)
      .order("fecha_ingreso", { ascending: false })
      .limit(limite);

    for (const item of porCarroceria ?? []) {
      if (resultado.length >= limite) break;
      if (idsUsados.has(item.id)) continue;
      resultado.push(item);
      idsUsados.add(item.id);
    }
  }

  if (resultado.length < limite) {
    const { data: recientes } = await supabase
      .from(TABLA)
      .select("*")
      .neq("id", auto.id)
      .order("fecha_ingreso", { ascending: false })
      .limit(limite + idsUsados.size);

    for (const item of recientes ?? []) {
      if (resultado.length >= limite) break;
      if (idsUsados.has(item.id)) continue;
      resultado.push(item);
      idsUsados.add(item.id);
    }
  }

  return resultado.slice(0, limite);
}

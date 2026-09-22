import { supabase } from "@/lib/supabase";
import type { AutoCatalogo } from "@/lib/types";
import { POR_PAGINA, type Filtros } from "@/lib/filtros";
import type { FacetRow } from "@/lib/facets";

const TABLA = "catalogo_publico";

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

export interface ResultadoCatalogo {
  autos: AutoCatalogo[];
  total: number;
}

export async function getAutosPaginados(filtros: Filtros): Promise<ResultadoCatalogo> {
  let query = supabase.from(TABLA).select("*", { count: "exact" });

  if (filtros.q) {
    const texto = filtros.q.replace(/[,()]/g, " ").trim();
    if (texto) {
      const patron = `%${texto}%`;
      query = query.or(
        `marca.ilike.${patron},modelo.ilike.${patron},version.ilike.${patron}`
      );
    }
  }

  if (filtros.marca.length > 0) query = query.in("marca", filtros.marca);
  if (filtros.modelo.length > 0) query = query.in("modelo", filtros.modelo);
  if (filtros.anioMin) query = query.gte("anio", filtros.anioMin);
  if (filtros.anioMax) query = query.lte("anio", filtros.anioMax);
  if (filtros.precioMin) query = query.gte("precio_ars", filtros.precioMin);
  if (filtros.precioMax) query = query.lte("precio_ars", filtros.precioMax);
  if (filtros.kmMax) query = query.lte("km", filtros.kmMax);
  if (filtros.combustible.length > 0) query = query.in("combustible", filtros.combustible);
  if (filtros.transmision.length > 0) query = query.in("transmision", filtros.transmision);
  if (filtros.carroceria.length > 0) query = query.in("carroceria", filtros.carroceria);
  if (filtros.condicion) query = query.eq("condicion", filtros.condicion);
  if (filtros.sinSenados) query = query.neq("estado", "senado");

  switch (filtros.orden) {
    case "precio_asc":
      query = query.order("precio_ars", { ascending: true });
      break;
    case "precio_desc":
      query = query.order("precio_ars", { ascending: false });
      break;
    case "nuevos":
      query = query.order("anio", { ascending: false });
      break;
    case "km":
      query = query.order("km", { ascending: true });
      break;
    default:
      query = query
        .order("destacado_web", { ascending: false })
        .order("fecha_ingreso", { ascending: false });
  }

  const desde = (filtros.page - 1) * POR_PAGINA;
  const hasta = desde + POR_PAGINA - 1;
  const { data, count } = await query.range(desde, hasta);

  return { autos: data ?? [], total: count ?? 0 };
}

export async function getFacetsBase(): Promise<FacetRow[]> {
  const { data } = await supabase
    .from(TABLA)
    .select("marca, modelo, combustible, transmision, carroceria");

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

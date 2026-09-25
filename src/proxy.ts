import { NextResponse, type NextRequest } from "next/server";

/**
 * Fichas de auto (/autos/:slug), resueltas antes de renderizar:
 * - slug que existe: sigue a la página normal;
 * - slug viejo (se editó el auto: cambia marca/modelo/versión/año pero no los
 *   6 caracteres finales, que son el inicio del id): 308 al slug actual;
 * - slug que no existe más: reescribe a una ruta inexistente para que Next
 *   sirva el 404 raíz (app/not-found.tsx) renderizado en el servidor, con
 *   status 404. Un notFound() tirado desde la página, en cambio, sale como un
 *   documento vacío que arma el cliente (pantalla en blanco sin JS).
 * El slug viaja en x-ficha-slug para que el 404 ofrezca autos parecidos.
 */

const RUTA_404 = "/ficha-no-disponible";
const VIGENCIA_MS = 60 * 1000;

type AutoSlug = { id: string; slug: string };

// Lista de slugs vigentes en memoria por 60 s, para no sumar una consulta en
// cada visita. Si un slug no está, se vuelve a consultar antes de decidir (un
// auto recién publicado no puede dar 404).
let cache: { autos: AutoSlug[]; hasta: number } | null = null;

async function slugsVigentes(forzar: boolean): Promise<AutoSlug[] | null> {
  if (!forzar && cache && cache.hasta > Date.now()) return cache.autos;
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/catalogo_publico?select=id,slug&estado=neq.senado`;
    const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    const res = await fetch(url, {
      headers: { apikey: clave, Authorization: `Bearer ${clave}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const autos = (await res.json()) as AutoSlug[];
    cache = { autos, hasta: Date.now() + VIGENCIA_MS };
    return autos;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const slug = decodeURIComponent(request.nextUrl.pathname.split("/")[2] ?? "");
  const headers = new Headers(request.headers);
  headers.set("x-ficha-slug", slug.slice(0, 200));
  const seguir = () => NextResponse.next({ request: { headers } });

  let autos = await slugsVigentes(false);
  if (autos && !autos.some((a) => a.slug === slug)) autos = await slugsVigentes(true);
  // Sin datos (Supabase caído): que la página resuelva como siempre.
  if (!autos) return seguir();
  if (autos.some((a) => a.slug === slug)) return seguir();

  const sufijo = slug.match(/-([0-9a-f]{6})$/i)?.[1]?.toLowerCase();
  if (sufijo) {
    const candidatos = autos.filter(
      (a) => a.slug.endsWith(`-${sufijo}`) && a.id.startsWith(sufijo)
    );
    if (candidatos.length === 1) {
      const destino = request.nextUrl.clone();
      destino.pathname = `/autos/${candidatos[0].slug}`;
      return NextResponse.redirect(destino, 308);
    }
  }

  const destino = request.nextUrl.clone();
  destino.pathname = RUTA_404;
  return NextResponse.rewrite(destino, { request: { headers } });
}

export const config = {
  matcher: "/autos/:slug",
};

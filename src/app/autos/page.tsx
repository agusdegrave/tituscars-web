import { AutoGrid } from "@/components/auto-grid";
import { FiltrosPanel } from "@/components/catalogo/filtros-panel";
import { FiltrosDrawer } from "@/components/catalogo/filtros-drawer";
import { FiltrosActivos } from "@/components/catalogo/filtros-activos";
import { CondicionTabs } from "@/components/catalogo/condicion-tabs";
import { OrdenSelect } from "@/components/catalogo/orden-select";
import { Paginacion } from "@/components/catalogo/paginacion";
import { EstadoVacio } from "@/components/catalogo/estado-vacio";
import { getAnios, getAutosPaginados, getFacetsBase } from "@/lib/autos";
import { calcularFacets } from "@/lib/facets";
import { parseFiltros, type SearchParamsCatalogo } from "@/lib/filtros";

export const revalidate = 60;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsCatalogo>;
}) {
  const sp = await searchParams;
  const filtros = parseFiltros(sp);

  const [facetRows, anios, resultado] = await Promise.all([
    getFacetsBase(),
    getAnios(),
    getAutosPaginados(filtros),
  ]);

  const { marcas, hayTransmision, hayCarroceria } = calcularFacets(facetRows);
  const { autos, total } = resultado;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="hidden w-[260px] shrink-0 lg:sticky lg:top-16 lg:block lg:max-h-[calc(100vh-4rem)] lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1">
          <FiltrosPanel
            filtros={filtros}
            marcas={marcas}
            anios={anios}
            hayTransmision={hayTransmision}
            hayCarroceria={hayCarroceria}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Catálogo</h1>

          <div className="mb-5 mt-6 lg:hidden">
            <FiltrosDrawer
              filtros={filtros}
              marcas={marcas}
              anios={anios}
              hayTransmision={hayTransmision}
              hayCarroceria={hayCarroceria}
              total={total}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 lg:mt-4">
            <CondicionTabs filtros={filtros} />
            <OrdenSelect filtros={filtros} />
          </div>

          <div className="mt-4">
            <FiltrosActivos filtros={filtros} />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {total} {total === 1 ? "auto" : "autos"}
          </p>

          <div className="mt-4">
            {autos.length > 0 ? (
              <AutoGrid autos={autos} />
            ) : (
              <EstadoVacio textoBusqueda={filtros.q} />
            )}
          </div>

          <Paginacion filtros={filtros} total={total} />
        </div>
      </div>
    </div>
  );
}

import { FiltrosPanel } from "@/components/catalogo/filtros-panel";
import { FiltrosDrawer } from "@/components/catalogo/filtros-drawer";
import { FiltrosActivos } from "@/components/catalogo/filtros-activos";
import { CondicionTabs } from "@/components/catalogo/condicion-tabs";
import { OrdenSelect } from "@/components/catalogo/orden-select";
import { CatalogoInfinito } from "@/components/catalogo/catalogo-infinito";
import { EstadoVacio } from "@/components/catalogo/estado-vacio";
import { getAnios, getAutosPaginados, getFacetsBase } from "@/lib/autos";
import { calcularFacets } from "@/lib/facets";
import { filtrosAParams, parseFiltros, type SearchParamsCatalogo } from "@/lib/filtros";

export const revalidate = 60;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsCatalogo>;
}) {
  const sp = await searchParams;
  // Scroll infinito: siempre arranca en la primera tanda (un ?page= viejo se ignora).
  const filtros = { ...parseFiltros(sp), page: 1 };
  const claveFiltros = filtrosAParams(filtros).toString();

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
        <aside className="hidden w-[260px] shrink-0 lg:sticky lg:top-16 lg:flex lg:max-h-[calc(100vh-4rem)] lg:flex-col">
          <FiltrosPanel
            filtros={filtros}
            marcas={marcas}
            anios={anios}
            hayTransmision={hayTransmision}
            hayCarroceria={hayCarroceria}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <h1 className="text-2xl font-bold tracking-tight">Catálogo</h1>
            <CondicionTabs filtros={filtros} />
            <div className="hidden lg:block lg:justify-self-end">
              <OrdenSelect filtros={filtros} />
            </div>
          </div>

          {/* Celu: Filtros y orden en la misma fila, mitad y mitad. */}
          <div className="mb-5 mt-6 grid grid-cols-2 gap-2 lg:hidden">
            <FiltrosDrawer
              filtros={filtros}
              marcas={marcas}
              anios={anios}
              hayTransmision={hayTransmision}
              hayCarroceria={hayCarroceria}
            />
            <OrdenSelect
              filtros={filtros}
              className="w-full justify-center border-border data-[size=default]:h-10 bg-background px-2.5 font-medium hover:bg-muted *:data-[slot=select-value]:flex-none"
            />
          </div>

          <div className="mt-4">
            <FiltrosActivos filtros={filtros} />
          </div>

          <div className="mt-4">
            {autos.length > 0 ? (
              <CatalogoInfinito
                key={claveFiltros}
                inicial={autos}
                total={total}
                filtros={filtros}
                claveFiltros={claveFiltros}
              />
            ) : (
              <EstadoVacio textoBusqueda={filtros.q} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

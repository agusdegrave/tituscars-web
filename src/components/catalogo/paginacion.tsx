import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { filtrosAParams, POR_PAGINA, type Filtros } from "@/lib/filtros";

function href(f: Filtros, page: number): string {
  const params = filtrosAParams({ ...f, page });
  return `/autos${params.size > 0 ? `?${params.toString()}` : ""}`;
}

export function Paginacion({ filtros, total }: { filtros: Filtros; total: number }) {
  const totalPaginas = Math.ceil(total / POR_PAGINA);
  if (totalPaginas <= 1) return null;

  const pagina = Math.min(filtros.page, totalPaginas);

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {pagina > 1 ? (
        <Link
          href={href(filtros, pagina - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        Página {pagina} de {totalPaginas}
      </span>

      {pagina < totalPaginas ? (
        <Link
          href={href(filtros, pagina + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border opacity-40">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

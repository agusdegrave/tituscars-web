import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusquedaAMedida } from "@/components/busqueda-a-medida";

export function EstadoVacio() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground" />
      <p className="mt-4 text-base font-medium">No encontramos autos con esos filtros</p>
      <Button
        variant="outline"
        className="mt-4"
        render={<Link href="/autos" />}
        nativeButton={false}
      >
        Limpiar filtros
      </Button>

      <BusquedaAMedida sobreGris className="mt-10 w-full max-w-3xl text-left" />
    </div>
  );
}

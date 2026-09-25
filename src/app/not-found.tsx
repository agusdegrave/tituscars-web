import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { FichaNoDisponible } from "@/components/ficha/no-disponible";

/**
 * 404 de toda la web, renderizado en el servidor con header, footer y status
 * 404. Si viene de una ficha de auto que ya no existe (src/proxy.ts reescribe
 * acá y deja el slug en x-ficha-slug), muestra "Este auto ya no está
 * disponible" con autos parecidos.
 */
export default async function NoEncontrado() {
  const slugFicha = (await headers()).get("x-ficha-slug");
  if (slugFicha) return <FichaNoDisponible slug={slugFicha} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">No encontramos esta página</h1>
      <p className="mt-3 text-muted-foreground">
        Puede que el link esté mal escrito o que la página ya no exista.
      </p>
      <Button size="lg" className="mt-6" render={<Link href="/autos" />} nativeButton={false}>
        Ver catálogo
      </Button>
    </div>
  );
}

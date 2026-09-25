import { headers } from "next/headers";
import { FichaNoDisponible } from "@/components/ficha/no-disponible";

// Respaldo: normalmente un slug inexistente lo resuelve src/proxy.ts antes de
// llegar acá (reescribe al 404 raíz, que sí se renderiza en el servidor). Esto
// cubre el caso raro de un auto que se despublicó hace menos de un minuto.
export default async function AutoNoEncontrado() {
  const slug = (await headers()).get("x-ficha-slug") ?? "";
  return <FichaNoDisponible slug={slug} />;
}

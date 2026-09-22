import { Check } from "lucide-react";
import type { DescripcionItem } from "@/lib/types";

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function Descripcion({
  items,
  extra,
}: {
  items: DescripcionItem[] | null;
  extra: string | null;
}) {
  const tieneItems = items && items.length > 0;
  const tieneExtra = Boolean(extra);

  if (!tieneItems && !tieneExtra) return null;

  const grupos = new Map<string, string[]>();
  for (const item of items ?? []) {
    const lista = grupos.get(item.grupo) ?? [];
    lista.push(item.texto);
    grupos.set(item.grupo, lista);
  }

  return (
    <div>
      <h2 className="text-lg font-bold">Descripción</h2>

      {tieneItems && (
        <div className="mt-4 flex flex-col gap-6">
          {Array.from(grupos.entries()).map(([grupo, textos]) => (
            <div key={grupo}>
              <h3 className="text-sm font-semibold text-muted-foreground">
                {capitalizar(grupo)}
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {textos.map((texto, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tieneExtra && (
        <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{extra}</p>
      )}
    </div>
  );
}

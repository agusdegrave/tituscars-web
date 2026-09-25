import { Fragment, type ReactNode } from "react";
import { Check } from "lucide-react";
import { parsePublicacion } from "@/lib/descripcion";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/config";
import type { DescripcionItem } from "@/lib/types";

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// "Instragram" también: aparece así, mal escrito, en algunas publicaciones.
const REDES: Record<string, string> = {
  instagram: INSTAGRAM_URL,
  instragram: INSTAGRAM_URL,
  tiktok: TIKTOK_URL,
};

/**
 * Línea del cierre con links: "Instagram" y "Tiktok" van a los perfiles (los
 * mismos del footer) y una URL suelta (ej. un video de YouTube) queda cliqueable.
 */
function conLinksARedes(linea: string): ReactNode {
  return linea.split(/(\binstr?agram\b|\btiktok\b|https?:\/\/\S+)/i).map((parte, i) => {
    const url = /^https?:\/\//i.test(parte) ? parte : REDES[parte.toLowerCase()];
    return url ? (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-brand"
      >
        {parte}
      </a>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    );
  });
}

function ListaConCheck({ textos }: { textos: string[] }) {
  return (
    <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
      {textos.map((texto, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {texto}
        </li>
      ))}
    </ul>
  );
}

/**
 * Descripción de la ficha. Usa el texto de publicación del legajo si tiene
 * items; si no, los descripcion_items / descripcion_extra de siempre.
 */
export function Descripcion({
  publicacion,
  items,
  extra,
}: {
  publicacion: string | null;
  items: DescripcionItem[] | null;
  extra: string | null;
}) {
  const { items: itemsPublicacion, cierre } = parsePublicacion(publicacion);
  const usaPublicacion = itemsPublicacion.length > 0;
  const tieneItems = !usaPublicacion && items && items.length > 0;
  const tieneExtra = !usaPublicacion && Boolean(extra);

  if (!usaPublicacion && !tieneItems && !tieneExtra && cierre.length === 0) return null;

  const grupos = new Map<string, string[]>();
  for (const item of (tieneItems && items) || []) {
    const lista = grupos.get(item.grupo) ?? [];
    lista.push(item.texto);
    grupos.set(item.grupo, lista);
  }

  return (
    <div>
      <h2 className="text-lg font-bold">Descripción</h2>

      {usaPublicacion && (
        <div className="mt-4">
          <ListaConCheck textos={itemsPublicacion} />
        </div>
      )}

      {tieneItems && (
        <div className="mt-4 flex flex-col gap-6">
          {Array.from(grupos.entries()).map(([grupo, textos]) => (
            <div key={grupo}>
              <h3 className="text-sm font-semibold text-muted-foreground">
                {capitalizar(grupo)}
              </h3>
              <ListaConCheck textos={textos} />
            </div>
          ))}
        </div>
      )}

      {tieneExtra && (
        <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{extra}</p>
      )}

      {cierre.length > 0 && (
        <div className="mt-5 flex flex-col gap-1 text-xs text-muted-foreground">
          {cierre.map((linea, i) => (
            <p key={i}>{conLinksARedes(linea)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

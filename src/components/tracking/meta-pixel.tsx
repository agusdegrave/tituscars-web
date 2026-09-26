"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PIXEL_ID, pageView, track, type DatosEvento } from "@/lib/tracking";

/** Datos del auto que llevan los links de WhatsApp de la ficha (data-track-*). */
function datosDelLink(link: HTMLAnchorElement): DatosEvento {
  const valor = Number(link.dataset.trackValor);
  return {
    auto_id: link.dataset.trackAutoId || undefined,
    slug: link.dataset.trackSlug || undefined,
    valor: Number.isFinite(valor) && valor > 0 ? valor : undefined,
  };
}

/**
 * Medición global, montado una vez en el layout:
 * - PageView del Pixel en cada navegación del App Router (el snippet oficial
 *   del <head> ya carga el Pixel y manda el PageView de la carga);
 * - cualquier click a WhatsApp (wa.me) de toda la web es click_whatsapp/Lead,
 *   y un tel: es click_llamar. El link NO se toca: sigue siendo un <a href>
 *   que abre al instante; el evento sale por sendBeacon en el mismo click.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    pageView();
  }, [pathname]);

  useEffect(() => {
    const alClick = (evento: MouseEvent) => {
      try {
        const link = (evento.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
        if (!link) return;
        const href = link.href;
        if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
          track("click_whatsapp", datosDelLink(link));
        } else if (href.startsWith("tel:")) {
          track("click_llamar", datosDelLink(link));
        }
      } catch {
        // nunca rompe el click
      }
    };
    document.addEventListener("click", alClick, true);
    return () => document.removeEventListener("click", alClick, true);
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

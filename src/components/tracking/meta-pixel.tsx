"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { PIXEL_ID, SNIPPET_PIXEL, pageView, track, type DatosEvento } from "@/lib/tracking";

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
 * Meta Pixel + medición global, montado una vez en el layout:
 * - carga el Pixel (afterInteractive) y manda PageView en cada navegación;
 * - cualquier click a WhatsApp (wa.me) de toda la web es click_whatsapp/Lead,
 *   y un tel: es click_llamar. El link NO se toca: sigue siendo un <a href>
 *   que abre al instante; el evento sale por sendBeacon en el mismo click.
 */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
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
      <Script id="meta-pixel" strategy="afterInteractive">
        {SNIPPET_PIXEL(PIXEL_ID)}
      </Script>
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

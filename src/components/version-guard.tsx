"use client";

import { useEffect } from "react";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID;
const CADA_MS = 5 * 60 * 1000;
const CLAVE_RECARGA = "version-guard-recarga";
const ESPERA_ENTRE_RECARGAS_MS = 30 * 1000;

/**
 * Una pestaña abierta desde antes de un deploy tiene el HTML viejo, cuyos
 * chunks JS ya no existen: la hidratación falla y la página no responde a los
 * toques. Esto la recarga sola cuando detecta que quedó en otra versión.
 */
function recargarUnaVez() {
  try {
    const ultima = Number(sessionStorage.getItem(CLAVE_RECARGA) ?? 0);
    // Si ya recargó hace menos de 30 s, no insiste (evita un bucle).
    if (Date.now() - ultima < ESPERA_ENTRE_RECARGAS_MS) return;
    sessionStorage.setItem(CLAVE_RECARGA, String(Date.now()));
  } catch {
    // Sin sessionStorage (privado, bloqueado) igual se recarga.
  }
  window.location.reload();
}

async function chequearVersion() {
  try {
    const res = await fetch("/api/version", { cache: "no-store" });
    if (!res.ok) return;
    const { v } = (await res.json()) as { v?: string };
    if (v && BUILD_ID && v !== BUILD_ID) recargarUnaVez();
  } catch {
    // Sin conexión o error del servidor: se reintenta en el próximo chequeo.
  }
}

function esErrorDeChunk(motivo: unknown): boolean {
  const texto =
    motivo instanceof Error ? `${motivo.name} ${motivo.message}` : String(motivo ?? "");
  return (
    texto.includes("ChunkLoadError") ||
    texto.includes("Loading chunk") ||
    texto.includes("Failed to fetch dynamically imported module")
  );
}

export function VersionGuard() {
  useEffect(() => {
    try {
      const alVolver = () => {
        if (document.visibilityState === "visible") void chequearVersion();
      };

      // Un <script> o <link> de /_next/ que no carga: el chunk ya no existe.
      const alFallarRecurso = (evento: Event) => {
        try {
          const el = evento.target as HTMLScriptElement | HTMLLinkElement | null;
          const url =
            el instanceof HTMLScriptElement ? el.src : el instanceof HTMLLinkElement ? el.href : "";
          if (url.includes("/_next/")) recargarUnaVez();
        } catch {
          // Nunca debe romper la página.
        }
      };

      const alRechazo = (evento: PromiseRejectionEvent) => {
        try {
          if (esErrorDeChunk(evento.reason)) recargarUnaVez();
        } catch {
          // Nunca debe romper la página.
        }
      };

      document.addEventListener("visibilitychange", alVolver);
      window.addEventListener("error", alFallarRecurso, true);
      window.addEventListener("unhandledrejection", alRechazo);
      const intervalo = window.setInterval(() => void chequearVersion(), CADA_MS);

      return () => {
        document.removeEventListener("visibilitychange", alVolver);
        window.removeEventListener("error", alFallarRecurso, true);
        window.removeEventListener("unhandledrejection", alRechazo);
        window.clearInterval(intervalo);
      };
    } catch {
      // Nunca debe romper la página.
    }
  }, []);

  return null;
}

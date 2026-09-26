import type { NextConfig } from "next";

// Versión del build: en Vercel, el commit; en local, la hora del build. Se
// graba en el bundle (cliente y servidor) y la usa el VersionGuard.
const BUILD_ID = process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  images: {
    // Next 16 solo acepta las calidades de esta lista (por defecto [75]); una
    // que no esté se sirve con la más cercana. 50 es para las miniaturas.
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nfkrhkewfusvdxsyuggg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    // URLs viejas de Tienda Nube (tituscars.com apuntaba ahí antes de esta
    // web). Google las tiene indexadas: van con 301 (permanent) a la página
    // equivalente acá, para no perder el posicionamiento.
    //
    // Una sola regla por path, SIN barra final: Next normaliza (308) toda
    // request con barra final sacándosela ANTES de mirar esta lista (probado
    // con el server real: /camionetas/ -> 308 a /camionetas -> recién ahí
    // esta regla -> /autos?carroceria=camioneta). Agregar también la versión
    // con barra sería una regla muerta que nunca se llega a evaluar.
    //
    // /autos/ no necesita regla: ya coincide con esta web.
    //
    // Las URLs de Tienda Nube que llevan query (/productos, /search, carrito,
    // cuenta, etc.) NO van acá: estas reglas le pasan al destino toda la query
    // de la request, sin forma de sacarla ni de renombrar un parámetro. Esas
    // las resuelve src/proxy.ts (MD-WEB tanda 25).
    return [
      // Filtros por carrocería de Tienda Nube -> el mismo filtro acá.
      { source: "/camionetas", destination: "/autos?carroceria=camioneta", permanent: true },
      { source: "/suv", destination: "/autos?carroceria=suv", permanent: true },
      { source: "/utilitarios", destination: "/autos?carroceria=utilitario", permanent: true },
      { source: "/motos", destination: "/autos?carroceria=moto", permanent: true },
      { source: "/0-km", destination: "/autos?condicion=0km", permanent: true },
      // /0km (sin guion) es la ruta vieja de ESTA web (tanda 1c/3), no de
      // Tienda Nube: se mantiene por las dudas de que haya quedado indexada.
      { source: "/0km", destination: "/autos?condicion=0km", permanent: true },

      // /contacto/ tampoco necesita regla: coincide con esta web, mismo caso
      // que /autos/.

      // /vende-tu-auto se sacó (MD-WEB tanda 2): Titus no compra autos, los
      // toma en permuta o en consigna. Si alguien tiene el link viejo, va a
      // consigna, que es la opción que más le conviene al que quiere vender.
      { source: "/vende-tu-auto", destination: "/consigna", permanent: true },
    ];
  },
};

export default nextConfig;

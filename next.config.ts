import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    return [
      // Catálogo viejo: /productos/ (listado) y /productos/<slug>/ (ficha).
      // Las fichas viejas no se pueden mapear 1 a 1 a un slug nuevo, así que
      // todas van al catálogo. `:path*` cubre /productos, /productos/algo y
      // cualquier variante anidada.
      { source: "/productos", destination: "/autos", permanent: true },
      { source: "/productos/:path*", destination: "/autos", permanent: true },

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

      // Cuenta / carrito / checkout de Tienda Nube: no existen acá, a Inicio.
      { source: "/account", destination: "/", permanent: true },
      { source: "/account/:path*", destination: "/", permanent: true },
      { source: "/comprar", destination: "/", permanent: true },
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/checkout/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;

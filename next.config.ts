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
  // Las redirecciones (URLs viejas de Tienda Nube, prefijos de idioma, barra
  // final y *.vercel.app -> tituscars.com) viven en src/proxy.ts: los
  // redirects de acá le pasan toda la query al destino sin poder filtrarla, y
  // la barra final la saca el proxy para que una URL vieja con barra resuelva
  // en un solo 308 (si no, Next hace un 308 propio antes y quedan dos).
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

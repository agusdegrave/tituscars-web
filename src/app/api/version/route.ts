// Versión del build que está sirviendo el servidor. El VersionGuard del
// navegador la compara con la suya: si difieren, la pestaña quedó vieja.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { v: process.env.NEXT_PUBLIC_BUILD_ID },
    { headers: { "Cache-Control": "no-store" } }
  );
}

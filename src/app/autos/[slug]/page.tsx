import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { getAutoPorSlug, getSimilares, getSlugActualPorSufijo } from "@/lib/autos";
import type { AutoCatalogo } from "@/lib/types";
import { formatKm, formatPrecio, tituloAuto } from "@/lib/format";
import { FichaGallery } from "@/components/ficha/gallery";
import { FichaTecnica } from "@/components/ficha/ficha-tecnica";
import { WhatsappCta } from "@/components/ficha/whatsapp-bar";
import { Descripcion } from "@/components/ficha/descripcion";
import { VideoSection } from "@/components/ficha/video";
import { Confianza } from "@/components/ficha/confianza";
import { AutoGrid } from "@/components/auto-grid";
import { JsonLd } from "@/components/json-ld";
import { BusquedaAMedida } from "@/components/busqueda-a-medida";
import { DIRECCION_CALLE } from "@/lib/config";
import { linkWhatsapp, mensajeConsultaAuto } from "@/lib/whatsapp";

export const revalidate = 60;

/**
 * Busca el auto y, si el slug no existe, resuelve antes de renderizar nada:
 * - si el auto cambió de slug (se editó la versión, el año, etc.), 308 al
 *   slug actual, a nivel HTTP;
 * - si no existe más, notFound() (404 con el HTML real de not-found.tsx).
 * Se llama en generateMetadata y al principio de la página.
 */
async function resolverAuto(slug: string): Promise<AutoCatalogo> {
  const auto = await getAutoPorSlug(slug);
  if (auto) return auto;

  const slugActual = await getSlugActualPorSufijo(slug);
  if (slugActual && slugActual !== slug) permanentRedirect(`/autos/${slugActual}`);

  notFound();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const auto = await getAutoPorSlug(slug);
  if (!auto) return {};

  const titulo = `${tituloAuto(auto)} ${auto.anio}`;
  const descripcion = [
    String(auto.anio),
    formatKm(auto.km),
    auto.combustible,
    formatPrecio(auto.precio, auto.moneda),
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title: `${titulo} | Titus Cars`,
    description: descripcion,
    openGraph: {
      title: `${titulo} | Titus Cars`,
      description: descripcion,
      type: "website",
      images: auto.foto_principal ? [{ url: auto.foto_principal }] : undefined,
    },
  };
}

export default async function FichaAutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const auto = await resolverAuto(slug);

  const similares = await getSimilares(auto);

  // Link de la ficha con el dominio por el que entró el cliente, para el
  // mensaje de WhatsApp (el <a href> se arma acá, en el servidor).
  const encabezados = await headers();
  const host = encabezados.get("x-forwarded-host") ?? encabezados.get("host") ?? "";
  const protocolo = encabezados.get("x-forwarded-proto") ?? "https";
  const urlFicha = `${protocolo}://${host}/autos/${auto.slug}`;
  const titulo = tituloAuto(auto);
  const precioFormateado = formatPrecio(auto.precio, auto.moneda);
  const fotos = auto.fotos && auto.fotos.length > 0
    ? auto.fotos
    : auto.foto_principal
      ? [{ url: auto.foto_principal, orden: 0, principal: true }]
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: titulo,
    brand: { "@type": "Brand", name: auto.marca },
    model: [auto.modelo, auto.version].filter(Boolean).join(" "),
    vehicleModelDate: String(auto.anio),
    // Datos estructurados para buscadores: km real (el redondeo es solo visual).
    ...(auto.km !== null
      ? {
          mileageFromOdometer: {
            "@type": "QuantitativeValue",
            value: auto.km,
            unitCode: "KMT",
          },
        }
      : {}),
    ...(auto.foto_principal ? { image: auto.foto_principal } : {}),
    offers: {
      "@type": "Offer",
      price: auto.precio,
      priceCurrency: auto.moneda,
      availability:
        auto.estado === "senado" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:pb-8">
      <JsonLd data={jsonLd} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FichaGallery
            fotos={fotos}
            alt={titulo}
            senado={auto.estado === "senado"}
            ceroKm={auto.condicion === "0km"}
            disponibilidad={auto.disponibilidad}
          />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">{titulo}</h1>
            <p className="text-muted-foreground">{auto.anio}</p>
            <p className="mt-2 text-3xl font-black">{precioFormateado}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {auto.disponibilidad === "salon"
                ? `Disponible en nuestro salón, ${DIRECCION_CALLE}`
                : "Este auto se ve con cita previa, escribinos para coordinar"}
            </p>
            {auto.estado === "senado" && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-black px-2.5 py-1 text-sm font-medium text-white">
                Este auto está señado. Consultanos por unidades similares.
              </p>
            )}
          </div>

          <WhatsappCta
            titulo={titulo}
            precioFormateado={precioFormateado}
            hrefWhatsapp={linkWhatsapp(
              mensajeConsultaAuto({
                titulo,
                anio: auto.anio,
                datos: [formatKm(auto.km), auto.combustible, precioFormateado]
                  .filter(Boolean)
                  .join(" · "),
                url: urlFicha,
                conCita: auto.disponibilidad === "cita",
              })
            )}
          />

          <FichaTecnica auto={auto} />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-12">
        <Descripcion
          publicacion={auto.publicacion_texto}
          items={auto.descripcion_items}
          extra={auto.descripcion_extra}
        />
        <VideoSection videoUrl={auto.video_url} />
      </div>

      {similares.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold">Te puede interesar</h2>
          <div className="mt-4">
            <AutoGrid autos={similares} />
          </div>
        </div>
      )}

      <div className="mt-12">
        <Confianza />
      </div>

      <BusquedaAMedida autoSlug={auto.slug} autoTitulo={`${titulo} ${auto.anio}`} className="mt-12" />
    </div>
  );
}

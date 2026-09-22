import Image from "next/image";
import { notFound } from "next/navigation";
import { getAutoPorSlug } from "@/lib/autos";
import { formatPrecio, tituloAuto } from "@/lib/format";

export const revalidate = 60;

export default async function FichaAutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const auto = await getAutoPorSlug(slug);

  if (!auto) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight uppercase">
        {tituloAuto(auto)}
      </h1>

      {auto.foto_principal && (
        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={auto.foto_principal}
            alt={tituloAuto(auto)}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <p className="mt-6 text-3xl font-black">
        {formatPrecio(auto.precio, auto.moneda)}
      </p>

      <p className="mt-8 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Ficha completa en construcción.
      </p>
    </div>
  );
}

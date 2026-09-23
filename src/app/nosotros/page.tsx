import type { Metadata } from "next";
import { InstagramIcon, YoutubeIcon, TikTokIcon } from "@/components/icons/social-icons";
import { getTotalEnStock } from "@/lib/autos";
import { ReelsSeccion } from "@/components/reels-seccion";
import { AUTOS_VENDIDOS, GOOGLE_PUNTAJE, INSTAGRAM_URL, TIKTOK_URL, YOUTUBE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nosotros | Titus Cars",
  description: "Quiénes somos: agencia de autos usados peritados en Córdoba, con consigna virtual como diferencial.",
};

export const revalidate = 60;

export default async function NosotrosPage() {
  const enStock = await getTotalEnStock();

  const numeros = [
    { valor: `+${AUTOS_VENDIDOS}`, label: "Autos vendidos" },
    { valor: GOOGLE_PUNTAJE, label: "En Google" },
    { valor: `${enStock}`, label: "Autos en stock" },
  ];

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Quiénes somos</h1>
        {/* TODO (Agustín): reemplazar este texto por el definitivo. */}
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            Titus Cars es una agencia de autos usados en Córdoba. Trabajamos con vehículos
            peritados, con garantía escrita y gestoría propia para que comprar o vender un
            auto sea simple, sin vueltas.
          </p>
          <p>
            Nuestro diferencial es la consigna virtual: vendemos tu auto sin que dejes de
            usarlo. Nos ocupamos de peritar, publicar en todos nuestros canales, atender las
            consultas y cerrar la venta, mientras vos seguís con tu día a día.
          </p>
        </div>
      </section>

      <section className="bg-brand-black py-14 text-white">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 text-center">
          {numeros.map((n) => (
            <div key={n.label}>
              <p className="text-3xl font-black text-brand sm:text-4xl">{n.valor}</p>
              <p className="mt-1 text-sm text-white/70">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ReelsSeccion />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">Nuestro local</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex aspect-[4/3] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground"
            >
              Foto próximamente
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold tracking-tight">Seguinos</h2>
        <div className="mt-4 flex items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-brand hover:text-brand"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-brand hover:text-brand"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-brand hover:text-brand"
          >
            <YoutubeIcon className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}

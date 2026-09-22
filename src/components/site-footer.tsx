import Link from "next/link";
import { linkWhatsapp } from "@/lib/whatsapp";
import { InstagramIcon, YoutubeIcon, StarIcon } from "@/components/icons/social-icons";

const TIKTOK_URL = "https://www.tiktok.com/@titus.cars";
const INSTAGRAM_URL = "https://www.instagram.com/titus.cars";
const YOUTUBE_URL = "https://www.youtube.com/@titus.cars";
const RESENAS_URL = "https://maps.app.goo.gl/Vsu7RQMskAvEWuCm8";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-1.02-.89-1.64-2.18-1.64-3.62h-3.12v14.24c0 1.53-1.25 2.78-2.78 2.78a2.78 2.78 0 0 1-2.78-2.78 2.78 2.78 0 0 1 2.78-2.78c.29 0 .57.04.83.13V10.6a5.9 5.9 0 0 0-.83-.06A5.9 5.9 0 0 0 3.16 16.44 5.9 5.9 0 0 0 9.06 22.3a5.9 5.9 0 0 0 5.9-5.86V9.03a8.24 8.24 0 0 0 4.82 1.55V7.46a5.15 5.15 0 0 1-3.18-1.64z" />
    </svg>
  );
}

export function SiteFooter() {
  const nombre = process.env.NEXT_PUBLIC_SITE_NAME ?? "Titus Cars";

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-black tracking-tight">{nombre.toUpperCase()}</p>
          <p className="mt-3 text-sm text-background/70">
            Av. Duarte Quirós 3996, Córdoba
          </p>
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-background/70 hover:text-background"
          >
            +54 9 351 328-3316
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-background/60">
            Navegación
          </p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-background/70">
            <Link href="/autos" className="hover:text-background">
              Catálogo
            </Link>
            <Link href="/0km" className="hover:text-background">
              0 KM
            </Link>
            <Link href="/consigna" className="hover:text-background">
              Consigná tu auto
            </Link>
            <Link href="/vende-tu-auto" className="hover:text-background">
              Vendé tu auto
            </Link>
            <Link href="/contacto" className="hover:text-background">
              Contacto
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-background/60">
            Seguinos
          </p>
          <div className="mt-3 flex items-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-background/70 hover:text-background"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-background/70 hover:text-background"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-background/70 hover:text-background"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
          </div>
          <a
            href={RESENAS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-background/70 hover:text-background"
          >
            <StarIcon className="h-4 w-4" />
            Ver reseñas en Google
          </a>
        </div>
      </div>

      <div className="border-t border-background/10 px-4 py-4 text-center text-xs text-background/50">
        © {new Date().getFullYear()} {nombre}. Todos los derechos reservados.
      </div>
    </footer>
  );
}

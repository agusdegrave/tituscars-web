"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { InstagramIcon } from "@/components/icons/social-icons";
import { REELS, type Reel } from "@/lib/reels";

export function ReelsSeccion() {
  if (REELS.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-bold tracking-tight">Conocenos en video</h2>
      <p className="mt-2 text-muted-foreground">
        Lo que hacemos todos los días, contado por nosotros.
      </p>

      {/* Celu: uno y medio a la vista, para que se note que hay más. Compu: 4 enteros. */}
      <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2">
        {REELS.map((reel) => (
          <ReelCard key={reel.video} reel={reel} />
        ))}
      </div>
    </section>
  );
}

function ReelCard({ reel }: { reel: Reel }) {
  const video = useRef<HTMLVideoElement>(null);
  const [conSonido, setConSonido] = useState(false);

  // Se reproduce solo (en silencio) mientras está a la vista y se pausa al salir.
  useEffect(() => {
    const el = video.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.play().catch(() => {
            // El navegador puede bloquear el autoplay: queda el poster.
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function alternarSonido() {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    setConSonido(!el.muted);
    if (el.paused) el.play().catch(() => {});
  }

  return (
    <div className="w-[62%] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]">
      <button
        type="button"
        onClick={alternarSonido}
        aria-label={conSonido ? "Silenciar video" : "Activar sonido"}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-brand-black"
      >
        <video
          ref={video}
          src={reel.video}
          poster={reel.poster}
          muted
          playsInline
          loop
          preload="none"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
          {conSonido ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </span>
      </button>

      {reel.titulo && <p className="mt-2 text-sm font-medium">{reel.titulo}</p>}
      <a
        href={reel.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand"
      >
        <InstagramIcon className="h-3.5 w-3.5" />
        Ver en Instagram
      </a>
    </div>
  );
}

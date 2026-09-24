"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Foto } from "@/lib/types";

export function FichaGallery({
  fotos,
  alt,
  senado,
  ceroKm,
}: {
  fotos: Foto[];
  alt: string;
  senado: boolean;
  ceroKm: boolean;
}) {
  const ordenadas = fotos.length > 0 ? [...fotos].sort((a, b) => a.orden - b.orden) : [];
  const [activo, setActivo] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [actual, setActual] = useState(1);
  // Carrusel de la foto principal (swipe): su foto visible es la activa.
  const [apiFoto, setApiFoto] = useState<CarouselApi>();

  useEffect(() => {
    if (!apiFoto) return;
    const onSelect = () => setActivo(apiFoto.selectedScrollSnap());
    apiFoto.on("select", onSelect);
    return () => {
      apiFoto.off("select", onSelect);
    };
  }, [apiFoto]);

  // Al cerrar el lightbox, la ficha queda en la foto que se estaba viendo.
  function cerrarLightbox() {
    apiFoto?.scrollTo(actual - 1, true);
    setLightboxAbierto(false);
  }

  useEffect(() => {
    if (!api) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActual(api.selectedScrollSnap() + 1);
    api.on("select", () => setActual(api.selectedScrollSnap() + 1));
  }, [api]);

  // Con el lightbox abierto: la página no scrollea, Esc cierra y las flechas pasan de foto.
  useEffect(() => {
    if (!lightboxAbierto) return;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cerrarLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        api?.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        api?.scrollNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxAbierto, api, actual]);

  if (ordenadas.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-xl bg-muted" aria-hidden="true" />
    );
  }

  return (
    <div>
      <div className="relative">
        {/* Se desliza con el dedo; un toque sin deslizar abre el lightbox (Embla no
            dispara el click cuando hubo arrastre). */}
        <Carousel setApi={setApiFoto} className="overflow-hidden rounded-xl bg-muted">
          <CarouselContent className="ml-0">
            {ordenadas.map((foto, i) => (
              <CarouselItem key={foto.url + i} className="pl-0">
                <button
                  type="button"
                  onClick={() => setLightboxAbierto(true)}
                  aria-label={`Ver foto ${i + 1} de ${ordenadas.length} en grande`}
                  className="relative block aspect-[4/3] w-full"
                >
                  <Image
                    src={foto.url}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {senado && (
            <span className="rounded-md bg-brand-black px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Señado
            </span>
          )}
          {ceroKm && (
            <span className="rounded-md bg-brand px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              0 KM
            </span>
          )}
        </div>
        {ordenadas.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
            {activo + 1} / {ordenadas.length}
          </span>
        )}
      </div>

      {ordenadas.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {ordenadas.map((foto, i) => (
            <button
              key={foto.url + i}
              type="button"
              onClick={() => {
                setActivo(i);
                apiFoto?.scrollTo(i);
              }}
              className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === activo ? "border-primary" : "border-transparent"
              }`}
            >
              <Image src={foto.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxAbierto && (
        <div className="fixed inset-x-0 top-0 z-[60] flex h-[100dvh] flex-col bg-black">
          <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white">
            <span className="text-sm">
              {actual} / {ordenadas.length}
            </span>
            <button
              type="button"
              onClick={cerrarLightbox}
              aria-label="Cerrar"
              className="rounded-full p-2 hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="min-h-0 flex-1 px-2 pb-6">
            <Carousel
              setApi={setApi}
              opts={{ align: "center", startIndex: activo, loop: true }}
              className="h-full w-full [&>[data-slot=carousel-content]]:h-full"
            >
              <CarouselContent className="h-full">
                {ordenadas.map((foto, i) => (
                  <CarouselItem key={foto.url + i} className="h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={foto.url}
                        alt={alt}
                        fill
                        sizes="100vw"
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 border-white/30 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:left-4" />
              <CarouselNext className="right-2 border-white/30 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:right-4" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}

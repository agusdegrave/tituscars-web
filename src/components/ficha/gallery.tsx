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

  useEffect(() => {
    if (!api) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActual(api.selectedScrollSnap() + 1);
    api.on("select", () => setActual(api.selectedScrollSnap() + 1));
  }, [api]);

  if (ordenadas.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-xl bg-muted" aria-hidden="true" />
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxAbierto(true)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={ordenadas[activo].url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
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
          <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
            {activo + 1} / {ordenadas.length}
          </span>
        )}
      </button>

      {ordenadas.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {ordenadas.map((foto, i) => (
            <button
              key={foto.url + i}
              type="button"
              onClick={() => setActivo(i)}
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
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm">
              {actual} / {ordenadas.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxAbierto(false)}
              aria-label="Cerrar"
              className="rounded-full p-2 hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-1 items-center px-2 pb-6">
            <Carousel
              setApi={setApi}
              opts={{ align: "center", startIndex: activo, loop: true }}
              className="w-full"
            >
              <CarouselContent>
                {ordenadas.map((foto, i) => (
                  <CarouselItem key={foto.url + i} className="flex items-center justify-center">
                    <div className="relative aspect-[4/3] w-full">
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

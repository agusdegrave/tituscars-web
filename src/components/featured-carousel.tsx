"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AutoCard } from "@/components/auto-card";
import type { AutoCatalogo } from "@/lib/types";

export function FeaturedCarousel({
  autos,
  totalEnStock,
}: {
  autos: AutoCatalogo[];
  totalEnStock: number;
}) {
  if (autos.length === 0) return null;

  return (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
      <CarouselContent>
        {autos.map((auto) => (
          <CarouselItem
            key={auto.id}
            className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <AutoCard auto={auto} />
          </CarouselItem>
        ))}
        {/* Cierre del carrusel: lleva al catálogo completo. */}
        <CarouselItem className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
          <Link
            href="/autos"
            className="group flex h-full min-h-72 flex-col items-center justify-center gap-2 rounded-xl border border-brand-black bg-brand-black p-6 text-center text-white transition-colors hover:border-brand"
          >
            <span className="text-xl font-black leading-tight">
              Ver más vehículos disponibles
            </span>
            <span className="text-sm text-white/60">
              {totalEnStock} autos en stock
            </span>
            <span
              aria-hidden
              className="mt-2 text-3xl text-brand transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

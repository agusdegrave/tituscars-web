"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AutoCard } from "@/components/auto-card";
import type { AutoCatalogo } from "@/lib/types";

export function FeaturedCarousel({ autos }: { autos: AutoCatalogo[] }) {
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
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

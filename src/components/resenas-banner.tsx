import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESENAS_CANTIDAD, RESENAS_URL } from "@/lib/config";

export function ResenasBanner() {
  return (
    <section className="bg-brand-light py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-brand text-brand" />
          ))}
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">5.0 en Google</h2>
        <p className="mt-1 text-brand-gray">
          Más de {RESENAS_CANTIDAD} clientes nos calificaron con 5 estrellas
        </p>
        <Button
          variant="outline"
          className="mt-6"
          render={<a href={RESENAS_URL} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
        >
          Leer reseñas
        </Button>
      </div>
    </section>
  );
}

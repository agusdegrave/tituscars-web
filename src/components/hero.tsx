import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/search-form";

export function Hero({
  pares,
  anios,
}: {
  pares: { marca: string; modelo: string }[];
  anios: number[];
}) {
  return (
    <section className="relative flex min-h-[85vh] flex-col justify-end overflow-hidden bg-[radial-gradient(ellipse_at_top,_#2a2a2a,_#0c0c0c)] px-4 pb-10 pt-32 text-white sm:min-h-[90vh]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Tu próximo auto te está esperando
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Usados peritados y con garantía en Córdoba
          </p>
          <Button
            size="lg"
            className="mt-6 h-12 px-6 text-base"
            render={<Link href="/autos" />}
            nativeButton={false}
          >
            Ver catálogo
          </Button>
        </div>

        <SearchForm pares={pares} anios={anios} />
      </div>
    </section>
  );
}

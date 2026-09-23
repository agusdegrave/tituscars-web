import Link from "next/link";
import { Button } from "@/components/ui/button";

const ACCESOS = [
  {
    titulo: "Consigná tu auto",
    texto:
      "Nuestro diferencial: dejanos tu auto en consigna virtual y nosotros nos encargamos de venderlo por vos, sin que te desprendas de él.",
    href: "/consigna",
    cta: "Quiero consignar",
  },
  {
    titulo: "Financiación",
    texto: "Financiá tu próximo auto con las mejores condiciones del mercado.",
    href: "/financiacion",
    cta: "Quiero saber más",
  },
];

export function AccesosBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {ACCESOS.map((acceso) => (
          <div
            key={acceso.titulo}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-bold">{acceso.titulo}</h3>
            <p className="flex-1 text-sm text-muted-foreground">{acceso.texto}</p>
            <Button
              variant="outline"
              className="mt-2 w-fit"
              render={<Link href={acceso.href} />}
              nativeButton={false}
            >
              {acceso.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

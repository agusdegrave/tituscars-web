import { ClipboardCheck, FileCheck, Landmark, RefreshCw } from "lucide-react";

const BENEFICIOS = [
  {
    icono: ClipboardCheck,
    titulo: "Autos peritados",
    texto: "Cada unidad pasa por nuestro peritaje antes de publicarse.",
  },
  {
    icono: FileCheck,
    titulo: "Garantía escrita",
    texto: "Brindamos garantía de caja y motor.",
  },
  {
    icono: Landmark,
    titulo: "Financiación",
    texto: "Trabajamos con distintos bancos y financieras.",
  },
  {
    icono: RefreshCw,
    titulo: "Recibimos tu usado",
    texto: "Tomamos tu auto como parte de pago.",
  },
];

export function BeneficiosBanner() {
  return (
    <section className="bg-brand-black py-14 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 lg:grid-cols-4">
        {BENEFICIOS.map(({ icono: Icono, titulo, texto }) => (
          <div key={titulo} className="flex flex-col items-center gap-3 text-center">
            <Icono className="h-7 w-7 text-brand" />
            <div>
              <p className="font-bold">{titulo}</p>
              <p className="mt-1 text-sm text-white/70">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

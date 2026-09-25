import { ShieldCheck, FileCheck, Wrench } from "lucide-react";

const ITEMS = [
  { icono: Wrench, texto: "Peritaje completo" },
  { icono: ShieldCheck, texto: "Garantía de caja y motor" },
  { icono: FileCheck, texto: "Gestoría propia para la transferencia" },
];

export function Confianza() {
  return (
    // Celu: el bloque centrado en la pantalla, con las líneas alineadas entre sí.
    <div className="border-t border-border pt-6">
      <div className="mx-auto grid w-fit grid-cols-1 gap-3 md:w-full md:grid-cols-3">
        {ITEMS.map(({ icono: Icono, texto }) => (
          <div key={texto} className="flex items-center gap-2.5 text-sm">
            <Icono className="h-5 w-5 shrink-0 text-primary" />
            <span>{texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

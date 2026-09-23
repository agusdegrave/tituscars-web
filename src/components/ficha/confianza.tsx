import { ShieldCheck, FileCheck, Wrench } from "lucide-react";

const ITEMS = [
  { icono: Wrench, texto: "Peritaje completo" },
  { icono: ShieldCheck, texto: "Garantía de caja y motor" },
  { icono: FileCheck, texto: "Gestoría propia para la transferencia" },
];

export function Confianza() {
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
      {ITEMS.map(({ icono: Icono, texto }) => (
        <div key={texto} className="flex items-center gap-2.5 text-sm">
          <Icono className="h-5 w-5 shrink-0 text-primary" />
          <span>{texto}</span>
        </div>
      ))}
    </div>
  );
}

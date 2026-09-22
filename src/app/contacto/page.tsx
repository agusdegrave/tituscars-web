import { linkWhatsapp } from "@/lib/whatsapp";

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contacto</h1>
      <p className="mt-4 text-muted-foreground">
        Escribinos por{" "}
        <a
          href={linkWhatsapp()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground underline underline-offset-2 hover:text-brand"
        >
          WhatsApp
        </a>{" "}
        o visitanos en Av. Duarte Quirós 3996, Córdoba. Muy pronto vas a poder
        completar un formulario de contacto acá mismo.
      </p>
    </div>
  );
}

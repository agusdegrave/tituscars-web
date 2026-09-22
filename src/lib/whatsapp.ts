export function linkWhatsapp(mensaje = "Hola, consulto desde la web."): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensaje de consulta por un auto, estilo Mercado Libre: el link va solo en su
 * línea para que WhatsApp arme la vista previa con la foto del auto.
 */
export function mensajeConsultaAuto({
  titulo,
  anio,
  datos,
  url,
  conCita,
}: {
  titulo: string;
  anio: number;
  datos: string;
  url: string;
  conCita: boolean;
}): string {
  const lineas = [
    "Hola, ¿cómo estás? Me interesó este vehículo:",
    `🚗 ${titulo} ${anio}`,
    datos,
    url,
  ];
  if (conCita) lineas.push("¿Puedo coordinar una cita para verlo?");
  return lineas.join("\n");
}

export function linkWhatsapp(mensaje = "Hola, consulto desde la web."): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

// Configuración editable del sitio. Agustín: revisá y corregí estas
// constantes cuando tengas los datos reales — no hace falta tocar código,
// solo estos valores.

// Reseñas de Google (bloque antes del footer y en /nosotros)
export const RESENAS_CANTIDAD = 100;
export const RESENAS_URL = "https://maps.app.goo.gl/Vsu7RQMskAvEWuCm8";

// Redes sociales (footer, /nosotros, /contacto)
export const INSTAGRAM_URL = "https://www.instagram.com/titus.cars";
export const TIKTOK_URL = "https://www.tiktok.com/@titus.cars";
export const YOUTUBE_URL = "https://www.youtube.com/@titus.cars";

// Horarios de atención (/contacto)
export const HORARIOS = "Lunes a viernes 9 a 18 hs · Sábados 9 a 13 hs";

// Cantidad de autos vendidos históricos (bloque de números en /nosotros)
export const AUTOS_VENDIDOS = 100;

// Entidades de financiación (/financiacion): vacío hasta que Agustín pase
// nombre + logo de cada banco/financiera. La grilla no se muestra si está vacío.
export interface EntidadFinanciera {
  nombre: string;
  /** Ruta del logo dentro de /public, ej. "/financiacion/banco-x.png". */
  logo: string;
}
export const ENTIDADES: EntidadFinanciera[] = [];

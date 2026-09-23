// Reseñas destacadas (debajo del puntaje de Google). SOLO reseñas reales,
// copiadas textuales del perfil de Google, con el nombre como figura ahí.
// La foto es de la entrega de ese cliente (subirla a /public/entregas/).
// Mientras la lista esté vacía, el bloque no se muestra.
export interface ResenaDestacada {
  nombre: string;
  texto: string;
  /** Ruta dentro de /public, ej. "/entregas/juan-perez.webp". */
  foto?: string;
  /** Auto que se llevó, ej. "Toyota Corolla 2019". Opcional. */
  auto?: string;
}

export const RESENAS_DESTACADAS: ResenaDestacada[] = [];

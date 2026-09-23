export interface Reel {
  /** Ruta del video en public/reels, ej. "/reels/reel-1.mp4". */
  video: string;
  /** Imagen de portada, ej. "/reels/reel-1.jpg". */
  poster: string;
  /** Link al reel en Instagram. */
  link: string;
  titulo?: string;
}

// Mientras esté vacío, la sección "Conocenos en video" no se muestra.
export const REELS: Reel[] = [];

export type Combustible = "Nafta" | "Diesel" | "GNC" | "Híbrido";
export type Transmision = "manual" | "automatica" | null;
export type Carroceria =
  | "auto"
  | "camioneta"
  | "suv"
  | "utilitario"
  | "moto"
  | null;
export type Condicion = "usado" | "0km";
export type Estado = "activo" | "senado";
export type Moneda = "ARS" | "USD";

export interface DescripcionItem {
  grupo: string;
  texto: string;
}

export interface Foto {
  url: string;
  orden: number;
  principal: boolean;
}

export interface AutoCatalogo {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  version: string | null;
  anio: number;
  km: number;
  color: string | null;
  color_hex: string | null;
  combustible: Combustible | null;
  transmision: Transmision;
  carroceria: Carroceria;
  condicion: Condicion;
  moneda: Moneda;
  precio: number;
  estado: Estado;
  destacado_web: boolean;
  descripcion_items: DescripcionItem[] | null;
  descripcion_extra: string | null;
  video_url: string | null;
  fecha_ingreso: string;
  actualizado_en: string;
  foto_principal: string | null;
  fotos: Foto[] | null;
}

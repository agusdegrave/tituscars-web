export interface FacetRow {
  marca: string;
  modelo: string;
  combustible: string | null;
  transmision: string | null;
  carroceria: string | null;
}

export interface FacetModelo {
  modelo: string;
  cantidad: number;
}

export interface FacetMarca {
  marca: string;
  cantidad: number;
  modelos: FacetModelo[];
}

export interface Facets {
  marcas: FacetMarca[];
  hayTransmision: boolean;
  hayCarroceria: boolean;
}

export function calcularFacets(filas: FacetRow[]): Facets {
  const porMarca = new Map<string, { cantidad: number; modelos: Map<string, number> }>();
  let hayTransmision = false;
  let hayCarroceria = false;

  for (const fila of filas) {
    const entrada = porMarca.get(fila.marca) ?? {
      cantidad: 0,
      modelos: new Map<string, number>(),
    };
    entrada.cantidad += 1;
    entrada.modelos.set(fila.modelo, (entrada.modelos.get(fila.modelo) ?? 0) + 1);
    porMarca.set(fila.marca, entrada);

    if (fila.transmision) hayTransmision = true;
    if (fila.carroceria) hayCarroceria = true;
  }

  const marcas: FacetMarca[] = Array.from(porMarca.entries())
    .map(([marca, { cantidad, modelos }]) => ({
      marca,
      cantidad,
      modelos: Array.from(modelos.entries())
        .map(([modelo, cant]) => ({ modelo, cantidad: cant }))
        .sort((a, b) => a.modelo.localeCompare(b.modelo)),
    }))
    .sort((a, b) => a.marca.localeCompare(b.marca));

  return { marcas, hayTransmision, hayCarroceria };
}

export function modelosParaMarcas(
  marcas: FacetMarca[],
  marcasSeleccionadas: string[]
): FacetModelo[] {
  const combinado = new Map<string, number>();

  for (const marca of marcas) {
    if (!marcasSeleccionadas.includes(marca.marca)) continue;
    for (const { modelo, cantidad } of marca.modelos) {
      combinado.set(modelo, (combinado.get(modelo) ?? 0) + cantidad);
    }
  }

  return Array.from(combinado.entries())
    .map(([modelo, cantidad]) => ({ modelo, cantidad }))
    .sort((a, b) => a.modelo.localeCompare(b.modelo));
}

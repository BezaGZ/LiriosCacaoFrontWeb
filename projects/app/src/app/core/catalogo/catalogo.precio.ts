/**
 * El motor de precios: funciones puras sobre las tablas.
 *
 * Aqui no hay un precio escrito. Todos los numeros salen de `Producto.precio`,
 * `Opcion.precioExtra` y `Grupo.incluidas`. Por eso subir el topping extra de
 * Q2 a Q3 es editar una celda, y nunca este archivo.
 *
 * Eso es lo que reemplaza a las tres interfaces `PrecioReglas*` de hoy: la
 * regla dejo de ser codigo y paso a ser dato.
 */

import {
  Capa, Catalogo, Grupo, Id, LineaPedido, Opcion, Paquete, Producto, TipoCapa,
} from './catalogo.models';

/** Una linea del desglose que se le muestra al cliente. */
export interface LineaDesglose {
  readonly texto: string;
  readonly monto: number;
}

// ---------------------------------------------------------------------------
// Busquedas
// ---------------------------------------------------------------------------

export function producto(cat: Catalogo, id: Id): Producto | null {
  return cat.productos.find((p) => p.id === id) ?? null;
}

export function opcion(cat: Catalogo, id: Id): Opcion | null {
  return cat.opciones.find((o) => o.id === id) ?? null;
}

export function grupo(cat: Catalogo, id: Id): Grupo | null {
  return cat.grupos.find((g) => g.id === id) ?? null;
}

/**
 * Las opciones que le tocan a un grupo.
 *
 * Si el grupo toma prestadas las de otro (el color de las lineas toma las del
 * chocolate), devuelve aquellas pero SIN costo: el cliente ya pago el topping,
 * elegir de que color va no se cobra de nuevo.
 */
export function opcionesDe(cat: Catalogo, g: Grupo): readonly Opcion[] {
  if (g.tomaOpcionesDe === null) {
    return cat.opciones
      .filter((o) => o.grupoId === g.id && o.disponible)
      .slice()
      .sort((a, b) => a.orden - b.orden);
  }

  const prestadas = cat.opciones
    .filter((o) => o.grupoId === g.tomaOpcionesDe && o.disponible)
    .slice()
    .sort((a, b) => a.orden - b.orden);

  return prestadas.map((o) => ({ ...o, grupoId: g.id, precioExtra: 0 }));
}

/** Los grupos de un configurador que se dibujan sueltos, en orden. */
export function gruposVisibles(cat: Catalogo, configuradorId: Id): readonly Grupo[] {
  return cat.grupos
    .filter((g) => g.configuradorId === configuradorId && g.visible)
    .slice()
    .sort((a, b) => a.orden - b.orden);
}

/**
 * La imagen de una combinacion, o null si esa foto no se ha tomado.
 *
 * Devolver null en vez de una ruta inventada es lo que deja que el catalogo
 * funcione con 42 fotos de las 112 posibles.
 */
export function capa(cat: Catalogo, productoId: Id, opcionId: Id, tipo: TipoCapa): Capa | null {
  return cat.capas.find(
    (c) => c.productoId === productoId && c.opcionId === opcionId && c.tipo === tipo,
  ) ?? null;
}

// ---------------------------------------------------------------------------
// Precio
// ---------------------------------------------------------------------------

/**
 * Cuanto suma un grupo segun lo que se eligio de el.
 *
 * Las `incluidas` del grupo se descuentan empezando por las opciones MAS
 * CARAS. Con los toppings de hoy da igual, porque todos cuestan Q2; importa el
 * dia que un topping valga mas que otro, y entonces lo que se regala es lo
 * caro. Un cliente nunca sale perdiendo por el orden en que marco las cosas.
 */
function sumaDelGrupo(g: Grupo, elegidas: readonly Opcion[]): number {
  const porPrecio = elegidas.slice().sort((a, b) => b.precioExtra - a.precioExtra);
  return porPrecio.slice(g.incluidas).reduce((total, o) => total + o.precioExtra, 0);
}

/**
 * Como se nombra un renglon del desglose.
 *
 * Un grupo que no regala nada nombra lo que se eligio ("Doble chocolate");
 * uno que regala las primeras nombra cuantas se cobran ("2 toppings extra"),
 * porque ahi lo que el cliente necesita entender es por que paga.
 */
function textoDelGrupo(g: Grupo, elegidas: readonly Opcion[]): string {
  if (g.tipo === 'uno') return `${g.nombre} ${elegidas[0].nombre.toLowerCase()}`;
  if (g.incluidas === 0) return elegidas.map((o) => o.nombre).join(', ');

  const cobradas = elegidas.length - g.incluidas;
  const singular = g.nombre.toLowerCase().replace(/s$/, '');
  return cobradas === 1 ? `Un ${singular} extra` : `${cobradas} ${g.nombre.toLowerCase()} extra`;
}

/** Las opciones elegidas de un grupo, ya resueltas a objetos. */
function elegidasDe(cat: Catalogo, linea: LineaPedido, g: Grupo): readonly Opcion[] {
  const disponibles = opcionesDe(cat, g);
  return linea.elecciones
    .filter((e) => e.grupoId === g.id)
    .map((e) => disponibles.find((o) => o.id === e.opcionId))
    .filter((o): o is Opcion => o !== undefined);
}

/**
 * El precio de UNA unidad, sin multiplicar por la cantidad.
 *
 * Devuelve null si el producto todavia no tiene precio: los ocho cafes estan
 * asi. Es a proposito que no devuelva 0, porque "no se sabe" y "sale gratis"
 * no son lo mismo y confundirlos pone a cobrar de menos.
 */
export function precioUnitario(cat: Catalogo, linea: LineaPedido): number | null {
  const p = producto(cat, linea.productoId);
  if (p === null || p.precio === null) return null;

  if (p.configuradorId === null) return p.precio;

  const gruposDelProducto = cat.grupos.filter((g) => g.configuradorId === p.configuradorId);
  const extras = gruposDelProducto.reduce(
    (total, g) => total + sumaDelGrupo(g, elegidasDe(cat, linea, g)),
    0,
  );

  return p.precio + extras;
}

/** El precio de la linea completa. null si el producto no tiene precio. */
export function precioLinea(cat: Catalogo, linea: LineaPedido): number | null {
  const unitario = precioUnitario(cat, linea);
  return unitario === null ? null : unitario * linea.cantidad;
}

/** El total del pedido. Las lineas sin precio no suman. */
export function precioPedido(cat: Catalogo, lineas: readonly LineaPedido[]): number {
  return lineas.reduce((total, l) => total + (precioLinea(cat, l) ?? 0), 0);
}

/** true si alguna linea todavia no tiene precio: el total esta incompleto. */
export function hayPreciosPendientes(cat: Catalogo, lineas: readonly LineaPedido[]): boolean {
  return lineas.some((l) => precioLinea(cat, l) === null);
}

// ---------------------------------------------------------------------------
// Desglose
// ---------------------------------------------------------------------------

/**
 * El detalle que ve el cliente, renglon por renglon.
 *
 * Sale de los mismos datos que el precio, asi que no pueden discrepar: no hay
 * forma de que el desglose diga una cosa y el total cobre otra.
 */
export function desglose(cat: Catalogo, linea: LineaPedido): readonly LineaDesglose[] {
  const p = producto(cat, linea.productoId);
  if (p === null || p.precio === null) return [];

  const filas: LineaDesglose[] = [{ texto: p.nombre, monto: p.precio }];

  if (p.configuradorId !== null) {
    const gruposDelProducto = cat.grupos
      .filter((g) => g.configuradorId === p.configuradorId)
      .slice()
      .sort((a, b) => a.orden - b.orden);

    for (const g of gruposDelProducto) {
      const elegidas = elegidasDe(cat, linea, g);
      const monto = sumaDelGrupo(g, elegidas);
      if (monto === 0) continue;

      filas.push({ texto: textoDelGrupo(g, elegidas), monto });
    }
  }

  return filas;
}

// ---------------------------------------------------------------------------
// Paquetes
// ---------------------------------------------------------------------------

/**
 * Cuantas unidades se entregan por un paquete, regalo incluido.
 *
 * El paquete de fiesta es `cantidad 15, gratis 1`: el cliente pide 15 y lleva
 * 16. Si pide mas de 15, `pedidas` manda y el regalo se mantiene.
 */
export function unidadesDelPaquete(paq: Paquete, pedidas?: number): number {
  const base = paq.desde ? Math.max(paq.cantidad, pedidas ?? paq.cantidad) : paq.cantidad;
  return base + paq.gratis;
}

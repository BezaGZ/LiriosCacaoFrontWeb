import { NewCartItem } from '@features/cart/cart.models';
import { ProductCategory } from '@core/ui-models/product-card.vm';
import { Catalogo, Id, LineaPedido, Paquete, Producto } from './catalogo.models';
import { desglose, precioUnitario, producto as buscarProducto } from './catalogo.precio';

/**
 * La costura entre el catálogo nuevo y el carrito que ya existe.
 *
 * El carrito guarda sus items con la forma del dominio viejo (`kind`,
 * `title`, `unitPrice`, `data`). Reescribirlo seria tocar la persistencia en
 * localStorage y los pedidos a medio armar que la gente ya tenga guardados,
 * asi que en vez de eso se traduce aqui. Este archivo es el unico lugar que
 * conoce las dos formas, y el dia que el carrito se modernice, es el unico
 * que hay que borrar.
 */

/** Las categorias del catalogo nuevo, dichas como las entiende el carrito. */
const CATEGORIA_A_KIND: Readonly<Record<string, ProductCategory>> = {
  cat_chocofruta: 'chocofruta',
  cat_helado: 'helado',
  cat_bebida: 'bebida',
  cat_paquete: 'paquete',
  cat_comida: 'bebida',
};

function kindDe(categoriaId: Id): ProductCategory {
  return CATEGORIA_A_KIND[categoriaId] ?? 'bebida';
}

/**
 * Un producto sin configurador: paleta, café o cualquier cosa que se agrega
 * tal cual.
 *
 * Devuelve null si no tiene precio. Los ocho cafés estan asi, y es mejor no
 * poder agregarlos que agregarlos a Q0.
 */
export function itemSimple(p: Producto, cantidad = 1): NewCartItem | null {
  if (p.precio === null) return null;

  return {
    kind: kindDe(p.categoriaId),
    title: p.nombre,
    qty: cantidad,
    unitPrice: p.precio,
    imageUrls: { base: p.imagen ?? '' },
    // Sin configuracion: la huella del carrito cae al titulo, que es
    // justamente lo que distingue una paleta de otra.
    data: {},
  };
}

/** Un paquete. Se vende por cantidad, asi que nunca lleva configuracion. */
export function itemPaquete(q: Paquete, fotos: readonly string[] = []): NewCartItem | null {
  if (q.precio === null) return null;

  return {
    kind: 'paquete',
    title: q.nombre,
    qty: 1,
    unitPrice: q.precio,
    imageUrls: { base: fotos[0] ?? '' },
    data: {},
  };
}

/**
 * Una chocofruta ya armada en el configurador.
 *
 * El detalle legible ("Blanco · angelitos · doble chocolate") se arma aqui
 * una sola vez y viaja en el titulo del item, para que el carrito y el
 * mensaje de WhatsApp digan exactamente lo mismo sin recalcularlo.
 */
export function itemConfigurado(
  cat: Catalogo,
  linea: LineaPedido,
): { item: NewCartItem; detalle: string } | null {
  const p = buscarProducto(cat, linea.productoId);
  const unitario = precioUnitario(cat, linea);
  if (p === null || unitario === null) return null;

  const elegidas = linea.elecciones
    .map(e => cat.opciones.find(o => o.id === e.opcionId))
    .filter((o): o is NonNullable<typeof o> => o !== undefined);

  const detalle = elegidas.map(o => o.nombre).join(' · ');

  return {
    detalle,
    item: {
      kind: kindDe(p.categoriaId),
      // El detalle va DENTRO del titulo a proposito. Sin `data.chocofruta`,
      // la huella del carrito cae al titulo; si el titulo fuera solo
      // "Chocopiña", dos armados distintos que cuesten lo mismo (dos toppings
      // intercambiados) se fusionarian en una sola linea y el cliente
      // recibiria dos iguales.
      title: detalle ? `${p.nombre} · ${detalle}` : p.nombre,
      qty: linea.cantidad,
      unitPrice: unitario,
      imageUrls: { base: p.imagen ?? '' },
      data: {},
    },
  };
}

/** El desglose del armado, para mostrarlo junto al precio. */
export function lineasDeDesglose(cat: Catalogo, linea: LineaPedido) {
  return desglose(cat, linea);
}

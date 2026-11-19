// core/products/all-products.ts

import { ProductCardVM } from '../ui-models/product-card.vm';
import { ALL_CHOCOFRUTAS } from './chocofruta.products';
import { ALL_HELADOS } from './helado.product';
import { ALL_FLORES } from './flor.products';

/*
 * Los eventos NO estan aqui a proposito.
 *
 * Tienen su propia pagina (/eventos), donde se ensenan con fotos grandes,
 * capacidad y la lista de lo que incluye. Meterlos ademas en este catalogo
 * los mostraba con la misma tarjeta que una chocofruta de Q7 y con un
 * "Consultar precio" que no dice nada. Desde /productos se llega por la
 * banda que hay arriba de la cuadricula.
 */
export const ALL_PRODUCTS: ProductCardVM[] = [
  ...ALL_CHOCOFRUTAS,
  ...ALL_HELADOS,
  ...ALL_FLORES,
];

// core/products/all-products.ts

import { ProductCardVM } from '../ui-models/product-card.vm';
import { ALL_CHOCOFRUTAS } from './chocofruta.products';
import { ALL_HELADOS } from './helado.product';

export const ALL_PRODUCTS: ProductCardVM[] = [
  ...ALL_CHOCOFRUTAS,
  ...ALL_HELADOS,
  // Cuando tengas más categorías, solo las agregas aquí
  // ...ALL_FLORES,
];

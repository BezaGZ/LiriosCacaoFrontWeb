// core/products/chocofruta.products.ts

import { CHOCOFRUTA_SEED } from '../../data';
import { Fruta, Chocolate, Topping } from '../../data/models';
import { calcularPrecioUnitarioChocofruta } from '../../data/chocofruta.logic';
import { buildChocoImagePaths } from '../utils/image-resolver';
import { ProductCardVM } from '../models/product-card.vm';

// Función "adaptadora" específica para chocofrutas
function chocofrutaToCardVM(fruta: Fruta, chocolate: Chocolate, topping?: Topping): ProductCardVM {
  const toppings = topping ? [topping] : [];
  const topPrincipal = topping?.nombre;

  const price = calcularPrecioUnitarioChocofruta(
    { fruta, chocolate, toppings, cantidad: 1 },
    CHOCOFRUTA_SEED.reglas
  );

  const imgPaths = buildChocoImagePaths(fruta.nombre, chocolate.nombre, topPrincipal);
  const imageUrl = imgPaths.withTop || imgPaths.withoutTop || imgPaths.fallback;

  let title = `Choco${fruta.nombre} con ${chocolate.nombre}`;
  if (topping) {
    title += ` + ${topping.nombre}`;
  }

  return {
    id: `choco-${fruta.slug}-${chocolate.colorSlug}${topping ? '-' + topping.id : ''}`,
    category: 'chocofruta',
    title: title,
    imageUrl: imageUrl,
    price: price,
    customizable: true, // Las chocofrutas son personalizables
    data: { fruta, chocolate, toppings } // Guardamos los datos originales
  };
}

// --- Aquí generamos la lista ---
// Podrías hacer todas las combinaciones posibles, pero es mejor empezar con una selección.
export const ALL_CHOCOFRUTAS: ProductCardVM[] = [
  chocofrutaToCardVM(CHOCOFRUTA_SEED.frutas[1], CHOCOFRUTA_SEED.chocolates[3], CHOCOFRUTA_SEED.toppings[0]), // Fresa Tradicional con Oreo
  chocofrutaToCardVM(CHOCOFRUTA_SEED.frutas[5], CHOCOFRUTA_SEED.chocolates[3]), // Banano Tradicional
  chocofrutaToCardVM(CHOCOFRUTA_SEED.frutas[2], CHOCOFRUTA_SEED.chocolates[4], CHOCOFRUTA_SEED.toppings[4]), // Piña Blanco con Coco
  // ... Agrega aquí más combinaciones base que quieras mostrar en el catálogo
];

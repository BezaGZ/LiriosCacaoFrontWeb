import { CHOCOFRUTA_SEED } from '../domain';
import { Fruta, Chocolate, Topping } from '../domain/chocofruta/chocofruta.models';
import { calcularPrecioUnitarioChocofruta } from '../domain/chocofruta/chocofruta.logic';
import { buildLayeredImagePaths } from '../utils/image-resolver'; // Solo importamos el nuevo
import { ProductCardVM } from '../ui-models/product-card.vm';

function chocofrutaToCardVM(fruta: Fruta, chocolate: Chocolate, topping?: Topping): ProductCardVM {
  const toppings = topping ? [topping] : [];
  const price = calcularPrecioUnitarioChocofruta(
    { fruta, chocolate, toppings, cantidad: 1 },
    CHOCOFRUTA_SEED.reglas
  );
  const paths = buildLayeredImagePaths(fruta.nombre, chocolate.nombre, topping?.nombre);
  let title = `Choco${fruta.nombre} con ${chocolate.nombre}`;
  if (topping) {
    title += ` + ${topping.nombre}`;
  }

  return {
    // Te recomiendo generar un ID único y estable aquí
    id: `choco-${fruta.slug}-${chocolate.colorSlug}${topping ? '-' + topping.id : '-base'}`,
    category: 'chocofruta',
    title: title,
    price: price,
    customizable: true,
    // --- CORRECCIÓN CLAVE AQUÍ ---
    // Envolvemos los datos dentro de una propiedad "chocofruta"
    data: {
      chocofruta: {
        fruta: fruta,
        chocolate: chocolate,
        toppings: toppings,
      }
    },
    imageUrls: {
      base: paths.baseImage,
      topping: paths.toppingImage
    }
  };
}

// La lista se queda igual
export const ALL_CHOCOFRUTAS: ProductCardVM[] = [
  chocofrutaToCardVM(CHOCOFRUTA_SEED.frutas[1], CHOCOFRUTA_SEED.chocolates[3], CHOCOFRUTA_SEED.toppings[0]), // Fresa Tradicional con Oreo
  chocofrutaToCardVM(CHOCOFRUTA_SEED.frutas[5], CHOCOFRUTA_SEED.chocolates[3]), // Banano Tradicional
  chocofrutaToCardVM(CHOCOFRUTA_SEED.frutas[2], CHOCOFRUTA_SEED.chocolates[4], CHOCOFRUTA_SEED.toppings[4]), // Piña Blanco con Coco
];

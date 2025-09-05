// core/utils/featured.adapter.ts

import { FeaturedPreset } from './featured.models';
import { buildLayeredImagePaths } from '@core/utils/image-resolver';
import { CHOCOFRUTA_SEED } from '@core/domain';
import { calcularPrecioUnitarioChocofruta } from '@core/domain/chocofruta/chocofruta.logic';
import { ProductCardVM } from '@core/ui-models/product-card.vm'; // <-- Importa el modelo universal

// Esta función ahora devuelve el ProductCardVM universal
export function presetToCard(p: FeaturedPreset): ProductCardVM {
  const { fruta, chocolate, toppings, dobleChocolate } = p;

  const price = calcularPrecioUnitarioChocofruta(
    { fruta, chocolate, toppings, dobleChocolate: !!dobleChocolate, cantidad: 1 },
    CHOCOFRUTA_SEED.reglas
  );

  const title = `Choco${fruta.nombre} con ${chocolate.nombre}` +
    (toppings.length > 0 ? ` + ${toppings.map(t => t.nombre).join(', ')}` : '');

  // Usamos el sistema de capas para obtener las imágenes
  const topPrincipal = toppings.length > 0 ? toppings[0] : undefined;
  const paths = buildLayeredImagePaths(fruta.nombre, chocolate.nombre, topPrincipal?.nombre);

  return {
    id: p.id,
    category: 'chocofruta',
    title: title,
    price: price,
    customizable: true,
    data: { chocofruta: { fruta, chocolate, toppings, dobleChocolate: !!dobleChocolate, cantidad: 1 } },
    imageUrls: {
      base: paths.baseImage,
      topping: paths.toppingImage,
    },
  };
}

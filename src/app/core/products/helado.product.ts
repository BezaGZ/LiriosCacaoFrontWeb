// core/products/helado.products.ts

import { HELADOS_PALETA_SEED } from '../domain/helado/helados.seed';
import { SaborHelado } from '../domain/helado/helado.models';
import { imgHeladoPaleta } from '../utils/image-resolver';
import { ProductCardVM } from '../ui-models/product-card.vm';

function heladoToCardVM(sabor: SaborHelado): ProductCardVM {
  return {
    id: sabor.id,
    category: 'helado',
    title: `Paleta de ${sabor.nombre}`,
    imageUrl: imgHeladoPaleta(sabor.slug), // Asumiendo que tienes una función para la imagen
    price: sabor.precio,
    customizable: false, // Los helados de paleta no se personalizan
    data: { sabor }
  };
}

export const ALL_HELADOS: ProductCardVM[] = HELADOS_PALETA_SEED.sabores
  .filter(s => s.disponible)
  .map(heladoToCardVM);

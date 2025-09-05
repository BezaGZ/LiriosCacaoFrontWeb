// core/products/helado.products.ts

import { HELADOS_PALETA_SEED } from '../domain/helado/helados.seed';
import { SaborHelado } from '../domain/helado/helado.models';
import { imgHeladoPaleta } from '../utils/image-resolver';
import { ProductCardVM } from '../ui-models/product-card.vm';

// core/products/helado.products.ts

function heladoToCardVM(sabor: SaborHelado): ProductCardVM {
  return {
    id: sabor.id,
    category: 'helado',
    title: `Paleta de ${sabor.nombre}`,
    price: sabor.precio,
    customizable: false,
    data: { sabor },
    // --- CORRECCIÓN AQUÍ ---
    // Usamos el nuevo formato de imageUrls
    imageUrls: {
      base: imgHeladoPaleta(sabor.slug), // La imagen principal va en 'base'
      topping: ''                        // Los helados no tienen topping
    }
  };
}

export const ALL_HELADOS: ProductCardVM[] = HELADOS_PALETA_SEED.sabores
  .filter(s => s.disponible)
  .map(heladoToCardVM);

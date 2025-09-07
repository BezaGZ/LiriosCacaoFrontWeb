// core/products/helado.product.ts

import { HELADO_SEED } from '../domain/helado/helados.seed';
import { SaborHelado } from '../domain/helado/helado.models';
import { imgHeladoPaleta } from '../utils/image-resolver';
import { ProductCardVM } from '../ui-models/product-card.vm';

// Esta función ahora crea una tarjeta para un helado BASE, listo para ser personalizado
function heladoToCardVM(sabor: SaborHelado): ProductCardVM {
  return {
    id: sabor.id,
    category: 'helado',
    title: `Paleta de ${sabor.nombre}`,
    price: sabor.precio, // Mostramos el precio "desde"
    customizable: true, // <-- ¡CAMBIO IMPORTANTE! Ahora es personalizable
    data: {
      helado: { // Envolvemos los datos para identificarlos
        sabor: sabor,
        chocolate: null,
        toppings: []
      }
    },
    imageUrls: {
      base: imgHeladoPaleta(sabor.slug),
      topping: ''
    }
  };
}

// La lista de productos se genera igual, pero ahora son personalizables
export const ALL_HELADOS: ProductCardVM[] = HELADO_SEED.sabores
  .filter(s => s.disponible)
  .map(heladoToCardVM);

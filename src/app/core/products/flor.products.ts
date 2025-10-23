import { FLORES_SEED } from '../domain/flor/flor.seed';
import { Flor } from '../domain/flor/flor.models';
import { ProductCardVM } from '../ui-models/product-card.vm';

function florToCardVM(flor: Flor): ProductCardVM {
  return {
    id: flor.id,
    category: 'flor',
    title: flor.nombre,
    price: flor.precio,
    customizable: false, // No son editables, solo informativas
    data: {
      flor: flor
    },
    imageUrls: {
      base: flor.imagenUrl
    }
  };
}

export const ALL_FLORES: ProductCardVM[] = FLORES_SEED.flores.map(florToCardVM);

import { FLORES_SEED } from '../domain/flor/flor.seed';
import { Flor } from '../domain/flor/flor.models';
import { ProductCardVM } from '../ui-models/product-card.vm';
import { ItemCotizable } from '../ui-models/cotizable';

function florToCardVM(flor: Flor): ProductCardVM {
  // Las flores y los eventos comparten el dialogo de cotizacion, asi que los
  // dos publican sus datos con la misma forma.
  const cotizable: ItemCotizable = {
    nombre: flor.nombre,
    descripcion: flor.descripcion,
    precio: flor.precio,
    imagenUrl: flor.imagenUrl,
    incluye: flor.incluye,
    personalizaciones: flor.personalizaciones,
    notas: flor.notas,
  };

  return {
    id: flor.id,
    category: 'flor',
    title: flor.nombre,
    price: flor.precio,
    customizable: false,   // se cotiza, no se personaliza en linea
    data: { cotizable },
    imageUrls: { base: flor.imagenUrl }
  };
}

export const ALL_FLORES: ProductCardVM[] = FLORES_SEED.flores.map(florToCardVM);

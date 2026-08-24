import { EVENTOS_SEED } from '../domain/evento/evento.seed';
import { Evento } from '../domain/evento/evento.models';
import { ProductCardVM } from '../ui-models/product-card.vm';
import { ItemCotizable } from '../ui-models/cotizable';

function eventoToCardVM(evento: Evento): ProductCardVM {
  const cotizable: ItemCotizable = {
    nombre: evento.nombre,
    descripcion: evento.descripcion,
    precio: evento.precioDesde,
    esDesde: true,
    imagenUrl: evento.imagenUrl,
    galeria: evento.galeria,
    usaCuestionario: true,
    capacidad: evento.capacidad,
    incluye: evento.incluye,
    noIncluye: evento.noIncluye,
    personalizaciones: evento.personalizaciones,
    notas: evento.notas,
  };

  return {
    id: evento.id,
    category: 'evento',
    title: evento.nombre,
    price: evento.precioDesde,
    customizable: false,   // se cotiza, no se personaliza en linea
    data: { cotizable },
    imageUrls: { base: evento.imagenUrl },
  };
}

export const ALL_EVENTOS: ProductCardVM[] = EVENTOS_SEED.eventos.map(eventoToCardVM);

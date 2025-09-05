import { Id, ConDisponibilidad } from '../base.models';

export interface SaborHelado extends ConDisponibilidad {
  id: Id;
  nombre: string;
  slug: string;
  precio: number;
  imagen?: string;
}

export interface CatalogoHeladosPaleta {
  tipo: 'paleta';
  sabores: SaborHelado[];
}

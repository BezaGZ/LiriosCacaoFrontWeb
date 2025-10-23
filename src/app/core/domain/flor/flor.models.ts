import { Id } from '../base.models';

export interface Flor {
  id: Id;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  incluye: string[];
  personalizaciones: string[];
  notas?: string[];
}

export interface CatalogoFlores {
  flores: Flor[];
}

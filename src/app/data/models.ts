export type Id = string;

export interface ConDisponibilidad {
  disponible: boolean;
}

export interface Fruta extends ConDisponibilidad {
  id: Id;
  nombre: string;
  slug: string;
  imagenBase?: string;
}

export interface Chocolate extends ConDisponibilidad {
  id: Id;
  nombre: string;
  color: string;
  esTradicional: boolean;
  colorSlug: string;
}

export interface Topping extends ConDisponibilidad {
  id: Id;
  nombre: string;
  imagen?: string;
}

export interface PrecioReglasChocofruta {
  baseConHastaUnTopping: number;
  recargoChocolateNoTradicional: number;
  recargoToppingExtra: number;
  recargoDobleChocolate: number;
}

export interface CatalogoChocofruta {
  frutas: Fruta[];
  chocolates: Chocolate[];
  toppings: Topping[];
  reglas: PrecioReglasChocofruta;
}

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

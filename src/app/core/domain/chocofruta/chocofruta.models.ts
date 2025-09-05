import { Id, ConDisponibilidad } from '../base.models';

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

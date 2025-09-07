// core/domain/helado/helado.models.ts

import { Id, ConDisponibilidad } from '../base.models';
import { Chocolate, Topping } from '../chocofruta/chocofruta.models'; // <-- Reutilizamos modelos

export interface SaborHelado extends ConDisponibilidad {
  id: Id;
  nombre: string;
  slug: string;
  precio: number; // Precio base del sabor
  imagen?: string;
}

// --- NUEVO ---
// Define las reglas de precios para los extras del helado
export interface PrecioReglasHelado {
  recargoChocolate: number;
  recargoTopping: number;
  recargoChocolateExtra: number; // Opcional, si se permite doble chocolate
}

// --- NUEVO ---
// Define la estructura de un helado personalizado
export interface SeleccionHelado {
  sabor: SaborHelado;
  chocolate?: Chocolate | null;
  toppings: Topping[];
  chocolateExtra?: boolean; // Si se permite doble chocolate
  cantidad: number;

}

// Actualizamos el catálogo para que incluya las reglas
export interface CatalogoHelado {
  tipo: 'paleta';
  sabores: SaborHelado[];
  reglas: PrecioReglasHelado;
}

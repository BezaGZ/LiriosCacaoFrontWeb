// core/domain/helado/helado.logic.ts

import { SeleccionHelado, PrecioReglasHelado } from './helado.models';

export function calcularPrecioUnitarioHelado(
  sel: SeleccionHelado,
  reglas: PrecioReglasHelado
): number {
  // 1. Empezamos con el precio base del sabor
  let total = sel.sabor.precio;

  // 2. Si se añade chocolate, sumamos el recargo
  if (sel.chocolate) {
    total += reglas.recargoChocolate;
  }

  if (sel.chocolateExtra) {
    total += reglas.recargoChocolateExtra;
  }

  total += sel.toppings.length * reglas.recargoTopping;

  return total;
}

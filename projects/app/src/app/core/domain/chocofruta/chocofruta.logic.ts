import { Fruta, Chocolate, Topping, PrecioReglasChocofruta } from './chocofruta.models';

export interface SeleccionChocofruta {
  fruta: Fruta;
  chocolate: Chocolate;
  toppings: Topping[];
  dobleChocolate?: boolean;
  cantidad: number;
}

export function calcularPrecioUnitarioChocofruta(
  sel: SeleccionChocofruta,
  reglas: PrecioReglasChocofruta
): number {
  let total = reglas.baseConHastaUnTopping;

  if (!sel.chocolate.esTradicional) {
    total += reglas.recargoChocolateNoTradicional;
  }

  const extras = Math.max(0, sel.toppings.length - 1);
  total += extras * reglas.recargoToppingExtra;

  if (sel.dobleChocolate) {
    total += reglas.recargoDobleChocolate;
  }

  return total;
}

export function calcularSubtotalChocofruta(
  sel: SeleccionChocofruta,
  reglas: PrecioReglasChocofruta
): number {
  return calcularPrecioUnitarioChocofruta(sel, reglas) * Math.max(1, sel.cantidad);
}

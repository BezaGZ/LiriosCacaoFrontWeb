import { calcularPrecioUnitarioHelado } from './helado.logic';
import { HELADO_SEED } from './helados.seed';
import { SaborHelado, SeleccionHelado } from './helado.models';
import { Chocolate, Topping } from '../chocofruta/chocofruta.models';

const reglas = HELADO_SEED.reglas;

const sabor: SaborHelado = { id: 'pal_oreo', nombre: 'Oreo', slug: 'oreo', precio: 8, disponible: true };
const choc: Chocolate = { id: 'choc_tradicional', nombre: 'Tradicional', color: 'cafe', colorSlug: 'cafe', esTradicional: true, disponible: true };
const top = (id: string): Topping => ({ id, nombre: id, disponible: true });

function sel(over: Partial<SeleccionHelado> = {}): SeleccionHelado {
  return { sabor, toppings: [], cantidad: 1, ...over };
}

describe('Precio de un helado', () => {

  it('sin extras cuesta el precio del sabor', () => {
    expect(calcularPrecioUnitarioHelado(sel(), reglas)).toBe(sabor.precio);
  });

  it('el bano de chocolate suma su recargo', () => {
    expect(calcularPrecioUnitarioHelado(sel({ chocolate: choc }), reglas))
      .toBe(sabor.precio + reglas.recargoChocolate);
  });

  it('a diferencia de la chocofruta, aqui se cobra DESDE el primer topping', () => {
    expect(calcularPrecioUnitarioHelado(sel({ toppings: [top('a')] }), reglas))
      .toBe(sabor.precio + reglas.recargoTopping);
  });

  it('cada topping suma', () => {
    expect(calcularPrecioUnitarioHelado(sel({ toppings: [top('a'), top('b'), top('c')] }), reglas))
      .toBe(sabor.precio + reglas.recargoTopping * 3);
  });

  it('el chocolate extra suma su recargo', () => {
    expect(calcularPrecioUnitarioHelado(sel({ chocolateExtra: true }), reglas))
      .toBe(sabor.precio + reglas.recargoChocolateExtra);
  });

  it('todo junto se acumula', () => {
    const todo = calcularPrecioUnitarioHelado(
      sel({ chocolate: choc, toppings: [top('a'), top('b')], chocolateExtra: true }), reglas);

    expect(todo).toBe(
      sabor.precio + reglas.recargoChocolate + reglas.recargoTopping * 2 + reglas.recargoChocolateExtra
    );
  });
});

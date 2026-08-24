import { calcularPrecioUnitarioChocofruta, calcularSubtotalChocofruta, SeleccionChocofruta } from './chocofruta.logic';
import { CHOCOFRUTA_SEED } from './chocofruta.seed';
import { Chocolate, Fruta, Topping } from './chocofruta.models';

/*
 * Estas pruebas cubren el calculo del precio, que es literalmente donde se
 * decide cuanto se cobra. Son funciones puras, asi que no hace falta montar
 * Angular: se llaman y se comprueba el numero.
 *
 * Si alguien cambia una regla de precio sin querer, esto se pone rojo antes
 * de que un cliente pague de menos.
 */

const reglas = CHOCOFRUTA_SEED.reglas;

const fruta: Fruta = { id: 'fru_fresa', nombre: 'Fresa', slug: 'fresa', disponible: true };
const tradicional: Chocolate = { id: 'choc_tradicional', nombre: 'Tradicional', color: 'cafe', colorSlug: 'cafe', esTradicional: true, disponible: true };
const guinda: Chocolate = { id: 'choc_guinda', nombre: 'Guinda', color: 'rosa', colorSlug: 'rosa', esTradicional: false, disponible: true };
const top = (id: string): Topping => ({ id, nombre: id, disponible: true });

function sel(over: Partial<SeleccionChocofruta> = {}): SeleccionChocofruta {
  return { fruta, chocolate: tradicional, toppings: [], cantidad: 1, ...over };
}

describe('Precio de una chocofruta', () => {

  it('sin nada extra cuesta el precio base', () => {
    expect(calcularPrecioUnitarioChocofruta(sel(), reglas)).toBe(reglas.baseConHastaUnTopping);
  });

  it('el primer topping va incluido en el precio base', () => {
    const conUno = calcularPrecioUnitarioChocofruta(sel({ toppings: [top('a')] }), reglas);
    expect(conUno).toBe(reglas.baseConHastaUnTopping);
  });

  it('a partir del segundo topping se cobra recargo por cada uno', () => {
    const dos  = calcularPrecioUnitarioChocofruta(sel({ toppings: [top('a'), top('b')] }), reglas);
    const tres = calcularPrecioUnitarioChocofruta(sel({ toppings: [top('a'), top('b'), top('c')] }), reglas);

    expect(dos).toBe(reglas.baseConHastaUnTopping + reglas.recargoToppingExtra);
    expect(tres).toBe(reglas.baseConHastaUnTopping + reglas.recargoToppingExtra * 2);
  });

  it('el chocolate no tradicional cuesta mas que el tradicional', () => {
    const conTradicional = calcularPrecioUnitarioChocofruta(sel({ chocolate: tradicional }), reglas);
    const conGuinda      = calcularPrecioUnitarioChocofruta(sel({ chocolate: guinda }), reglas);

    expect(conGuinda).toBe(conTradicional + reglas.recargoChocolateNoTradicional);
  });

  it('el doble chocolate suma su recargo', () => {
    const normal = calcularPrecioUnitarioChocofruta(sel(), reglas);
    const doble  = calcularPrecioUnitarioChocofruta(sel({ dobleChocolate: true }), reglas);

    expect(doble).toBe(normal + reglas.recargoDobleChocolate);
  });

  it('los recargos se acumulan entre si', () => {
    const todo = calcularPrecioUnitarioChocofruta(
      sel({ chocolate: guinda, toppings: [top('a'), top('b')], dobleChocolate: true }), reglas);

    expect(todo).toBe(
      reglas.baseConHastaUnTopping +
      reglas.recargoChocolateNoTradicional +
      reglas.recargoToppingExtra +
      reglas.recargoDobleChocolate
    );
  });

  it('el subtotal multiplica por la cantidad', () => {
    const unitario = calcularPrecioUnitarioChocofruta(sel(), reglas);
    expect(calcularSubtotalChocofruta(sel({ cantidad: 3 }), reglas)).toBe(unitario * 3);
  });

  it('una cantidad invalida se trata como 1, nunca como cero o negativo', () => {
    const unitario = calcularPrecioUnitarioChocofruta(sel(), reglas);
    expect(calcularSubtotalChocofruta(sel({ cantidad: 0 }),  reglas)).toBe(unitario);
    expect(calcularSubtotalChocofruta(sel({ cantidad: -5 }), reglas)).toBe(unitario);
  });
});

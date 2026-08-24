import { Fruta, Chocolate, Topping } from '@core/domain/chocofruta/chocofruta.models';
import { SaborHelado } from '@core/domain/helado/helado.models';
import { ItemCotizable } from './cotizable';

/**
 * Lo que se guarda de un producto personalizado, tanto en la tarjeta como en
 * el carrito.
 *
 * Antes esto era `any`, en un proyecto con TypeScript estricto. El resultado
 * era que dentro de `data` no habia autocompletado ni errores de compilacion:
 * un `t.nombre` mal escrito o un campo renombrado solo se descubrian cuando
 * algo se veia raro en pantalla.
 */

/** Chocofruta tal como quedo configurada por el cliente. */
export interface SeleccionChocofrutaGuardada {
  fruta: Fruta;
  chocolate: Chocolate;
  toppings: Topping[];
  dobleChocolate?: boolean;
  /** Sabor elegido para el topping "Lineas de chocolate". */
  lineasChocolateSlug?: string | null;
  cantidad?: number;
}

/** Helado tal como quedo configurado por el cliente. */
export interface SeleccionHeladoGuardada {
  sabor: SaborHelado;
  chocolate?: Chocolate | null;
  toppings: Topping[];
  chocolateExtra?: boolean;
  lineasChocolateSlug?: string | null;
  cantidad?: number;
}

/**
 * Los campos son excluyentes en la practica: una chocofruta trae `chocofruta`,
 * un helado trae `helado`, y flores y eventos traen `cotizable`. Van como
 * opcionales para que TypeScript OBLIGUE a comprobar cual es antes de usarlo.
 */
export interface ProductData {
  chocofruta?: SeleccionChocofrutaGuardada;
  helado?: SeleccionHeladoGuardada;
  cotizable?: ItemCotizable;
}

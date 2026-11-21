/**
 * Lo que el carrito guarda de un producto personalizado.
 *
 * Los tipos van definidos AQUI y no importados del dominio: el catalogo
 * nuevo arma el detalle dentro del titulo y ya no llena estos campos, pero
 * `buildConfigKey` los sigue leyendo y hay carritos guardados en navegadores
 * de clientes que todavia los traen. Si se borraran, un carrito viejo se
 * fusionaria mal y se cobraria de menos: es el bug caro que las pruebas de
 * `cart.service.spec.ts` existen para que no vuelva.
 *
 * Son las formas minimas que `buildConfigKey` necesita, no el dominio
 * completo. Cuando ya no queden carritos viejos en circulacion, esto y el
 * campo `data` del carrito se pueden ir juntos.
 */

/** Lo minimo para distinguir una opcion de otra. */
interface Opcion {
  id: string;
  nombre?: string;
}

/** Chocofruta tal como quedo configurada por el cliente. */
export interface SeleccionChocofrutaGuardada {
  fruta: Opcion;
  chocolate: Opcion;
  toppings: Opcion[];
  dobleChocolate?: boolean;
  /** Sabor elegido para el topping "Lineas de chocolate". */
  lineasChocolateSlug?: string | null;
  cantidad?: number;
}

/** Helado tal como quedo configurado por el cliente. */
export interface SeleccionHeladoGuardada {
  sabor: Opcion;
  chocolate?: Opcion | null;
  toppings: Opcion[];
  chocolateExtra?: boolean;
  lineasChocolateSlug?: string | null;
  cantidad?: number;
}

/**
 * Los campos son excluyentes en la practica, y van opcionales para que
 * TypeScript OBLIGUE a comprobar cual es antes de usarlo. Un producto del
 * catalogo nuevo no trae ninguno.
 */
export interface ProductData {
  chocofruta?: SeleccionChocofrutaGuardada;
  helado?: SeleccionHeladoGuardada;
}

/**
 * Los datos de entrega del cliente, guardados entre visitas.
 *
 * El carrito ya sobrevivia a una recarga; la direccion no. Y la direccion es
 * el dato mas caro de pedir dos veces: es lo unico del pedido que el cliente
 * tiene que escribir a mano, y es entrega a domicilio, asi que es obligatorio.
 * Quien cerraba la app a medio pedido volvia a escribirla entera.
 *
 * Mismo guion que `cart.storage.ts`: todo lo que puede fallar vive aqui
 * (no hay localStorage en el servidor, el modo privado puede lanzar, los
 * datos guardados pueden ser viejos) para que la pantalla no se entere.
 */

export type ModoEntrega = 'domicilio' | 'recoger';
export type FormaPago = 'efectivo' | 'tarjeta';
export type Momento = 'hoy' | 'manana';

export interface DatosEntrega {
  nombre: string;
  direccion: string;
  entrega: ModoEntrega;
  pago: FormaPago;
  momento: Momento;
  /** Con cuanto paga, si es en efectivo. */
  cambio: number | null;
}

export const DATOS_ENTREGA_VACIOS: DatosEntrega = {
  nombre: '',
  direccion: '',
  entrega: 'domicilio',
  pago: 'efectivo',
  momento: 'hoy',
  cambio: null,
};

const CLAVE = 'lirios-entrega';
const VERSION = 1;

/**
 * Mas largo que los 7 dias del carrito a proposito: un carrito viejo trae
 * precios viejos y conviene descartarlo, pero una direccion de hace un mes
 * sigue siendo la misma casa.
 */
const DIAS_VALIDO = 90;
const MS_VALIDO = DIAS_VALIDO * 24 * 60 * 60 * 1000;

interface Guardado {
  version: number;
  guardadoEn: number;
  datos: DatosEntrega;
}

function almacen(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

const texto = (x: unknown): string => (typeof x === 'string' ? x : '');

function esUno<T extends string>(x: unknown, validos: readonly T[], porDefecto: T): T {
  return validos.includes(x as T) ? (x as T) : porDefecto;
}

/** Nunca lanza: si algo sale mal, datos vacios y el cliente los escribe. */
export function leerEntrega(): DatosEntrega {
  const store = almacen();
  if (!store) return { ...DATOS_ENTREGA_VACIOS };

  try {
    const crudo = store.getItem(CLAVE);
    if (!crudo) return { ...DATOS_ENTREGA_VACIOS };

    const g = JSON.parse(crudo) as Guardado;
    if (g?.version !== VERSION) return descartar(store);
    if (!Number.isFinite(g.guardadoEn)) return descartar(store);
    if (Date.now() - g.guardadoEn > MS_VALIDO) return descartar(store);
    if (!g.datos || typeof g.datos !== 'object') return descartar(store);

    const d = g.datos;
    return {
      nombre: texto(d.nombre),
      direccion: texto(d.direccion),
      entrega: esUno(d.entrega, ['domicilio', 'recoger'] as const, 'domicilio'),
      pago: esUno(d.pago, ['efectivo', 'tarjeta'] as const, 'efectivo'),
      // El momento NO se restaura: "hoy" guardado la semana pasada seria
      // mentira, y es lo unico de aqui que caduca en horas.
      momento: 'hoy',
      cambio: Number.isFinite(d.cambio) ? (d.cambio as number) : null,
    };
  } catch {
    return descartar(store);
  }
}

export function guardarEntrega(datos: DatosEntrega): void {
  const store = almacen();
  if (!store) return;

  try {
    const g: Guardado = { version: VERSION, guardadoEn: Date.now(), datos };
    store.setItem(CLAVE, JSON.stringify(g));
  } catch {
    // Cuota llena o escritura bloqueada: el pedido sigue funcionando, solo
    // no sobrevive a una recarga.
  }
}

export function olvidarEntrega(): void {
  const store = almacen();
  try {
    store?.removeItem(CLAVE);
  } catch {
    // da igual
  }
}

function descartar(store: Storage): DatosEntrega {
  try {
    store.removeItem(CLAVE);
  } catch {
    // da igual
  }
  return { ...DATOS_ENTREGA_VACIOS };
}

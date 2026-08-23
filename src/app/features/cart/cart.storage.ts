import { CartItem } from './cart.models';

/**
 * Guardado del carrito en el navegador.
 *
 * Se separa del CartService a proposito: aqui vive todo lo que puede fallar
 * (no hay localStorage en el servidor, el usuario puede estar en modo privado,
 * los datos guardados pueden ser viejos o estar corruptos) para que el
 * servicio del carrito no tenga que preocuparse de nada de eso.
 */

const CLAVE = 'lirios-carrito';

/**
 * Sube este numero si cambia la forma de CartItem (por ejemplo si se agrega
 * una opcion nueva a buildConfigKey). Un carrito guardado con la forma vieja
 * se descarta en vez de restaurarse a medias.
 */
const VERSION = 1;

/**
 * Un carrito viejo trae precios viejos: el cliente veria el precio de hace
 * semanas y el pedido de WhatsApp saldria con ese monto. Pasados estos dias
 * se descarta y empieza de cero.
 */
const DIAS_VALIDO = 7;
const MS_VALIDO = DIAS_VALIDO * 24 * 60 * 60 * 1000;

interface CarritoGuardado {
  version: number;
  guardadoEn: number;
  items: CartItem[];
}

/** localStorage no existe en el servidor, y en modo privado puede lanzar. */
function almacen(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

function esItemValido(x: any): x is CartItem {
  return !!x
    && typeof x.id === 'string'
    && typeof x.title === 'string'
    && typeof x.configKey === 'string'
    && Number.isFinite(x.unitPrice)
    && Number.isInteger(x.qty) && x.qty > 0
    && !!x.imageUrls && typeof x.imageUrls.base === 'string';
}

/**
 * Devuelve el carrito guardado, o [] si no hay, esta vencido, es de otra
 * version o no se puede leer. Nunca lanza: si algo sale mal, carrito vacio.
 */
export function leerCarrito(): CartItem[] {
  const store = almacen();
  if (!store) return [];

  try {
    const crudo = store.getItem(CLAVE);
    if (!crudo) return [];

    const datos = JSON.parse(crudo) as CarritoGuardado;

    if (datos?.version !== VERSION) return descartar(store);
    if (!Array.isArray(datos.items)) return descartar(store);
    if (!Number.isFinite(datos.guardadoEn)) return descartar(store);
    if (Date.now() - datos.guardadoEn > MS_VALIDO) return descartar(store);

    // Se filtran los items rotos en vez de tirar el carrito entero: si de diez
    // productos uno quedo mal, es mejor conservar los otros nueve.
    const items = datos.items.filter(esItemValido);

    // Si se descarto alguno, se reescribe ya limpio; si no, el item roto se
    // quedaria guardado para siempre y se filtraria en cada carga.
    if (items.length !== datos.items.length) {
      guardarCarrito(items);
    }

    return items;
  } catch {
    return descartar(store);
  }
}

export function guardarCarrito(items: CartItem[]): void {
  const store = almacen();
  if (!store) return;

  try {
    if (!items.length) {
      store.removeItem(CLAVE);
      return;
    }
    const datos: CarritoGuardado = { version: VERSION, guardadoEn: Date.now(), items };
    store.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // Cuota llena o escritura bloqueada. El carrito sigue funcionando en
    // memoria; solo no sobrevive a una recarga.
  }
}

function descartar(store: Storage): CartItem[] {
  try {
    store.removeItem(CLAVE);
  } catch {
    // da igual
  }
  return [];
}

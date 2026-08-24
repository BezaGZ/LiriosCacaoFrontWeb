import { Id } from '../base.models';

/**
 * Un paquete de evento (15 anos, graduacion, alquiler de jardin...).
 *
 * A diferencia de una chocofruta o un helado, un evento NO se agrega al
 * carrito: se cotiza. El precio es un "desde" porque el precio final depende
 * de invitados, fecha y menu.
 *
 * La forma es casi igual a la de Flor a proposito: los dos son productos que
 * se conversan por WhatsApp en vez de comprarse en linea, y comparten el mismo
 * dialogo (ItemCotizable).
 */
export interface Evento {
  id: Id;
  nombre: string;
  slug: string;
  descripcion: string;
  /** Precio de partida. El final se cotiza. */
  precioDesde: number;
  /** Foto de portada: la que sale en la tarjeta del catalogo. */
  imagenUrl: string;
  /**
   * Fotos adicionales para el visor del dialogo.
   *
   * Un evento no se vende con una sola foto: quien va a gastar varios miles
   * quiere ver el lugar vacio, el lugar montado, un detalle y la fiesta con
   * gente. Las que falten se saltan solas.
   */
  galeria?: string[];
  /** Personas que caben, cuando el paquete incluye un lugar. */
  capacidad?: number;
  incluye: string[];
  /**
   * Lo que NO va en el paquete.
   *
   * Decirlo de frente se lee mas profesional que dejarlo vago, y evita la
   * ida y vuelta por WhatsApp descubriendo que la comida iba aparte.
   */
  noIncluye?: string[];
  personalizaciones: string[];
  notas?: string[];
}

export interface CatalogoEventos {
  eventos: Evento[];
}

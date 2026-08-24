/**
 * Lo que un producto necesita tener para mostrarse en el dialogo de
 * cotizacion: se ensena el detalle y se cierra por WhatsApp, sin carrito.
 *
 * Lo cumplen Flor y Evento. Existe para que los dos compartan un solo dialogo
 * en vez de tener uno casi identico cada uno.
 */
export interface ItemCotizable {
  nombre: string;
  descripcion: string;
  /** Precio a mostrar. Un 0 significa "sin precio" y no se pinta nada. */
  precio: number;
  /** true cuando el precio es orientativo y el final se cotiza. */
  esDesde?: boolean;
  imagenUrl: string;
  /** Fotos adicionales. Si viene vacio, se muestra solo imagenUrl. */
  galeria?: string[];
  /**
   * true cuando conviene preguntar antes de mandar a WhatsApp.
   * Los eventos si: sin saber ocasion, personas y que necesita, la duena
   * tendria que preguntar lo mismo cinco veces por chat. Las flores no: el
   * producto ya es la especificacion.
   */
  usaCuestionario?: boolean;
  /** Personas que caben, cuando aplica. */
  capacidad?: number;
  /**
   * Con modalidad 'alquiler' (o sin modalidad) la lista se titula "Incluye".
   * Con 'a-medida' se titula "Podemos incluir" y se agrega la aclaracion de
   * que cada servicio se cotiza por separado.
   */
  modalidad?: 'alquiler' | 'a-medida';
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

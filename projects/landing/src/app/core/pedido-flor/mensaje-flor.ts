/**
 * El mensaje de un pedido de floristeria.
 *
 * Vive aparte del componente y sin nada del navegador para poder probarlo
 * solo. Es la misma decision que en la app de pedidos: lo que se manda por
 * WhatsApp es lo unico que el negocio llega a leer, asi que es lo ultimo que
 * puede romperse en silencio.
 *
 * Escribe SOLO lo que la persona eligio. Un mensaje con huecos rellenos por
 * nosotros ("entrega lo antes posible") hace que el negocio conteste sobre
 * algo que el cliente nunca pidio.
 */

export interface PedidoFlor {
  /** Como se escribe la ocasion en una frase: "un cumpleanos". */
  readonly ocasion: string | null;
  /**
   * El tipo de arreglo COMO SE ESCRIBE EN UNA FRASE: "un ramo", no "Ramos".
   * El catalogo los nombra en plural y en una frase piden singular con
   * articulo; es el mismo motivo por el que las ocasiones tienen `enMensaje`.
   */
  readonly arreglo: string | null;
  /** Fecha de entrega en ISO (yyyy-mm-dd), como la da <input type="date">. */
  readonly fecha: string | null;
  /** La ciudad donde se entrega, para no obligar a preguntarla. */
  readonly ciudad: string;
}

/** Lo minimo para que el mensaje valga la pena: sin esto no se arma. */
export function faltaParaFlor(p: PedidoFlor): string | null {
  if (!p.arreglo) return 'Elija el tipo de arreglo.';
  return null;
}

/**
 * Pasa "2026-11-25" a "25 de noviembre".
 *
 * Se parte a mano y no con `new Date(iso)`: esa lectura trata la cadena como
 * UTC y en Guatemala, que va seis horas atras, devuelve el dia anterior. Una
 * entrega con un dia de diferencia es justo el error que no se nota hasta que
 * las flores llegan tarde.
 */
export function fechaEnPalabras(iso: string): string {
  const [anio, mes, dia] = iso.split('-').map(Number);
  if (!anio || !mes || !dia) return iso;

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  const nombre = meses[mes - 1];
  return nombre ? `${dia} de ${nombre}` : iso;
}

export function armarMensajeFlor(p: PedidoFlor): string {
  const partes: string[] = ['Hola, quiero pedir'];

  partes.push(p.arreglo ?? 'un arreglo');
  if (p.ocasion) partes.push(`para ${p.ocasion}`);

  let frase = partes.join(' ');
  if (p.fecha) frase += `, para entregar el ${fechaEnPalabras(p.fecha)}`;
  frase += ` en ${p.ciudad}.`;

  return frase;
}

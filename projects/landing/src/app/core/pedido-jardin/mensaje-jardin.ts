import { fechaEnPalabras } from '../pedido-flor/mensaje-flor';

/**
 * El mensaje de una consulta de disponibilidad del jardin.
 *
 * Mismo criterio que el de floristeria: vive aparte del componente y sin
 * nada del navegador para poder probarlo solo, y escribe SOLO lo que la
 * persona eligio.
 *
 * La fecha es obligatoria y las otras dos no. Sin fecha no hay nada que
 * consultar: "quiero el jardin" no se puede contestar.
 */

export interface ConsultaJardin {
  /** Fecha tentativa en ISO (yyyy-mm-dd), como la da <input type="date">. */
  readonly fecha: string | null;
  /** Como se escribe en la frase: "una boda". */
  readonly celebracion: string | null;
  /** El rango de invitados, tal cual se ofrece. */
  readonly invitados: string | null;
}

export function faltaParaJardin(c: ConsultaJardin): string | null {
  if (!c.fecha) return 'Elija una fecha tentativa.';
  return null;
}

export function armarMensajeJardin(c: ConsultaJardin): string {
  let frase = 'Hola, quiero consultar la disponibilidad del jardín';

  if (c.celebracion) frase += ` para ${c.celebracion}`;
  if (c.fecha) frase += ` el ${fechaEnPalabras(c.fecha)}`;
  if (c.invitados) frase += `, para ${c.invitados.toLowerCase()}`;

  return `${frase}.`;
}

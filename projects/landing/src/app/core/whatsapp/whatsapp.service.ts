import { Injectable } from '@angular/core';

import { NEGOCIO } from '../../contenido/sitio';

/**
 * Arma los enlaces de WhatsApp con el mensaje ya escrito.
 *
 * La diferencia entre un mensaje que dice "me interesa" y uno que dice
 * "me interesa el ramo Primavera" es la diferencia entre una consulta que hay
 * que descifrar y una que se puede responder de una vez. Por eso cada botón
 * del sitio lleva su propio contexto.
 */
@Injectable({ providedIn: 'root' })
export class WhatsappService {
  /**
   * @param mensaje lo que el visitante va a mandar, ya redactado por nosotros.
   */
  enlace(mensaje: string): string {
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  /** Para un arreglo concreto del catálogo. */
  porArreglo(nombre: string): string {
    return this.enlace(
      `Hola, me interesa el arreglo "${nombre}". ¿Me puede dar más información?`,
    );
  }

  /** Para la floristería en general. */
  porFlores(): string {
    return this.enlace(
      'Hola, quisiera hacer un pedido de flores. ¿Me puede ayudar?',
    );
  }

  /** Para un evento: pedimos lo mínimo que hace útil la primera respuesta. */
  porEvento(ocasion?: string): string {
    const que = ocasion ? ` para ${ocasion}` : '';
    return this.enlace(
      `Hola, quisiera cotizar un evento${que}. Le comparto la fecha y ` +
        'cuántas personas somos.',
    );
  }
}

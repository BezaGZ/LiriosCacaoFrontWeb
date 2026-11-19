import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Los iconos disponibles. Es una union cerrada a proposito: si alguien escribe
 * un nombre que no existe, el compilador lo detiene en vez de dejar el hueco
 * en blanco en produccion.
 */
export type IconoDato =
  | 'precio'
  | 'entrega'
  | 'calendario'
  | 'pago'
  | 'personas'
  | 'techo';

export interface Dato {
  readonly icono: IconoDato;
  /** Lo que se responde: "Desde Q100". */
  readonly titulo: string;
  /** El matiz, en letra menuda: "Ramos, canastas y arreglos". */
  readonly detalle: string;
}

/**
 * La tira de datos practicos que va pegada a la portada.
 *
 * Son las cuatro preguntas que alguien hace ANTES de escribir: cuanto cuesta,
 * hasta donde llega, con cuanta anticipacion y como se paga. Estaban en una
 * tabla a media pagina, donde ya nadie llega con esa duda encima.
 *
 * Vive en shared y no dentro de floristeria porque las otras paginas tienen
 * las mismas cuatro preguntas con otras respuestas.
 */
@Component({
  selector: 'lc-tira-datos',
  templateUrl: './tira-datos.component.html',
  styleUrl: './tira-datos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiraDatosComponent {
  readonly datos = input.required<readonly Dato[]>();

  /** Como se anuncia la tira a un lector de pantalla. */
  readonly etiqueta = input('Precios, entrega y pago');
}

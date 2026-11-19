import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevelarDirective } from '../../directives/revelar.directive';

/** De que linea del negocio habla la seccion. Decide el color del boton. */
export type Acento = 'flor' | 'evento';

/**
 * El bloque de cierre de una pagina: lo ultimo que se ve antes del pie.
 *
 * Las tres paginas interiores terminan igual — una invitacion a escribir por
 * WhatsApp — asi que el bloque vive una sola vez aqui. Antes era el mismo CSS
 * copiado en cada componente, que es como empiezan a separarse los disenos.
 */
@Component({
  selector: 'lc-cierre',
  imports: [RevelarDirective],
  templateUrl: './cierre.component.html',
  styleUrl: './cierre.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"acento-" + acento()' },
})
export class CierreComponent {
  readonly titulo = input.required<string>();
  readonly parrafos = input.required<readonly string[]>();
  readonly boton = input.required<string>();
  readonly enlace = input.required<string>();
  /** Antetitulo opcional: "¿Ya tiene fecha?", "Disponibilidad". */
  readonly kicker = input<string>();
  readonly acento = input<Acento>('flor');
}

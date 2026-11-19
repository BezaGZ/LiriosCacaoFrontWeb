import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevelarDirective } from '../../../../shared/directives/revelar.directive';
import { DECLARACION } from '../../../../contenido/sitio';

/**
 * El enunciado que sigue a la portada.
 *
 * Es la frase que carga con el problema de posicionamiento: nombra las cuatro
 * lineas del negocio sin listarlas.
 */
@Component({
  selector: 'lc-declaracion',
  imports: [RevelarDirective],
  templateUrl: './declaracion.component.html',
  styleUrl: './declaracion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclaracionComponent {
  protected readonly c = DECLARACION;
}

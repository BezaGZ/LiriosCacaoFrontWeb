import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RevelarDirective } from '../../../../shared/directives/revelar.directive';
import { FLORISTERIA } from '../../../../contenido/sitio';

/**
 * La franja de floristería en la portada.
 *
 * Aquí sí se usa NgOptimizedImage, a diferencia de la portada: la foto es la
 * misma en todos los tamaños, solo cambia cuánta resolución hace falta. Eso le
 * deja a Angular generar el srcset, diferir la carga y reservar el espacio
 * para que la página no brinque al bajar.
 */
@Component({
  selector: 'lc-floristeria-banda',
  imports: [NgOptimizedImage, RouterLink, RevelarDirective],
  templateUrl: './floristeria.component.html',
  styleUrl: './floristeria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloristeriaBandaComponent {
  protected readonly c = FLORISTERIA.banda;
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevelarDirective } from '../../../../shared/directives/revelar.directive';
import { APP } from '../../../../contenido/sitio';

/**
 * La franja que manda a la tienda en linea.
 *
 * Va en cafe solido y al final: cierra la portada y deja claro que hay dos
 * caminos distintos. Lo que se cotiza (flores, eventos) se pide escribiendo;
 * lo que tiene precio fijo (chocofrutas, helados) se pide en la app.
 *
 * El enlace sale del sitio, asi que es un <a href> y no un routerLink.
 */
@Component({
  selector: 'lc-app-banda',
  imports: [RevelarDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBandaComponent {
  protected readonly c = APP;
}

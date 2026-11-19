import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevelarDirective } from '../../../../shared/directives/revelar.directive';
import { INCLUIMOS } from '../../../../contenido/sitio';

/**
 * Lo que entra en un evento sin alquilar nada afuera.
 *
 * Es el argumento que decide una cotizacion: quien compara dos presupuestos
 * esta comparando cuantas cosas tiene que conseguir por su cuenta. Por eso va
 * en la portada y no escondido en la pagina de eventos.
 */
@Component({
  selector: 'lc-incluimos',
  imports: [RouterLink, RevelarDirective],
  templateUrl: './incluimos.component.html',
  styleUrl: './incluimos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncluimosComponent {
  protected readonly c = INCLUIMOS;
}

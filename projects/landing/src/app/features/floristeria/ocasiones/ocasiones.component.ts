import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  OCASIONES,
  Ocasion,
  avisoDeTemporada,
  diasPara,
  ocasionDeTemporada,
} from '../../../core/ocasiones/ocasiones';
import { WhatsappService } from '../../../core/whatsapp/whatsapp.service';
import { RevelarDirective } from '../../../shared/directives/revelar.directive';

/**
 * Las ocasiones, y la que viene en camino.
 *
 * Lleva ngSkipHydration porque lo que muestra DEPENDE DE LA FECHA. Las páginas
 * se generan al compilar, así que el servidor congelaría el día del build y en
 * mayo seguiría diciendo lo de noviembre. Saltándose la hidratación, esta
 * parte se arma siempre en el navegador, con la fecha de quien está mirando.
 */
@Component({
  selector: 'lc-ocasiones',
  imports: [RevelarDirective],
  templateUrl: './ocasiones.component.html',
  styleUrl: './ocasiones.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
})
export class OcasionesComponent {
  private readonly whatsapp = inject(WhatsappService);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly ocasiones = OCASIONES;

  /** La ocasión próxima, o null si no hay ninguna cerca. */
  protected readonly proxima: Ocasion | null = this.esNavegador
    ? ocasionDeTemporada(new Date())
    : null;

  protected readonly aviso = this.proxima
    ? avisoDeTemporada(diasPara(new Date(), this.proxima), this.proxima)
    : '';

  protected enlace(ocasion: Ocasion): string {
    return this.whatsapp.enlace(
      `Hola, quisiera un arreglo para ${ocasion.enMensaje}. ` +
        '¿Qué opciones tienen?',
    );
  }
}

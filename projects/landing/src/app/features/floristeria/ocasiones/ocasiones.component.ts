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

  /**
   * Las que caen un día fijo del calendario, EN ORDEN DE CALENDARIO. Son las
   * que de verdad venden, así que son las que llevan el peso visual; y
   * ordenadas por fecha la lista se lee como un año, no como el orden en que
   * se nos fueron ocurriendo.
   */
  protected readonly conFecha = OCASIONES.filter(
    (o): o is Ocasion & { mes: number; dia: number } =>
      o.mes !== undefined && o.dia !== undefined,
  ).sort((a, b) => a.mes - b.mes || a.dia - b.dia);

  /**
   * Las que no tienen fecha. Van en una línea corrida debajo: "Solo porque sí"
   * no puede pesar lo mismo que el Día de la Madre.
   *
   * El separador se calcula aquí y no en la plantilla porque ahí habría que
   * meterlo entre llaves de control de flujo, donde los espacios en blanco no
   * se comportan como uno espera.
   */
  protected readonly otras = OCASIONES.filter((o) => o.mes === undefined).map(
    (ocasion, indice, todas) => ({
      ocasion,
      texto: ocasion.etiqueta.toLocaleLowerCase('es'),
      // Coma entre todas menos las dos últimas, que se unen con "y".
      separador: indice === 0 ? ' ' : indice === todas.length - 1 ? ' y ' : ', ',
    }),
  );

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

import { Component, EventEmitter, Output, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Ocasion, OcasionInfo, diasPara, ocasionDeTemporada } from '@core/domain';

/**
 * Aviso que aparece solo cuando se acerca una fecha del calendario
 * (14 de febrero, 10 de mayo, 21 de septiembre) y se esconde el resto del ano.
 *
 * Es lo que mas convierte de la pagina: el 10 de mayo concentra mas venta que
 * meses enteros, y el que llega tres semanas antes no siempre sabe que hay que
 * reservar con anticipacion.
 *
 * Por que solo en el navegador: el sitio se prerenderiza, asi que el HTML se
 * genera el dia del BUILD. Si la banda se calculara ahi, quedaria congelada
 * -- podria decir "faltan 12 dias" durante meses, o no aparecer nunca porque
 * el build fue en agosto. Se calcula en el navegador, con la fecha real del
 * visitante.
 *
 * ngSkipHydration porque justamente el servidor no pinta nada y el navegador
 * si: sin esto Angular reclamaria que el HTML no coincide.
 */
@Component({
  selector: 'app-banda-estacional',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banda-estacional.component.html',
  styleUrl: './banda-estacional.component.scss',
  host: { 'ngSkipHydration': 'true' },
})
export class BandaEstacionalComponent {
  /** Al tocarla, la pagina filtra por esa ocasion. */
  @Output() elegir = new EventEmitter<Ocasion>();

  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  readonly ocasion: OcasionInfo | null = this.esNavegador
    ? ocasionDeTemporada(new Date())
    : null;

  private readonly faltan: number = this.ocasion
    ? diasPara(new Date(), this.ocasion)
    : 0;

  /** "Es hoy" pesa distinto que "faltan 18 dias": el texto se adapta. */
  get cuentaAtras(): string {
    if (this.faltan === 0) return 'Es hoy';
    if (this.faltan === 1) return 'Es mañana';
    return `Faltan ${this.faltan} días`;
  }

  /**
   * A dos dias o menos ya no tiene sentido invitar a reservar con dos dias de
   * anticipacion: se cambia el mensaje en vez de pedir algo imposible.
   */
  get aviso(): string {
    return this.faltan <= 2
      ? 'Escribinos hoy y vemos qué alcanzamos'
      : 'Reservá con 1 o 2 días de anticipación';
  }

  alTocar(): void {
    if (this.ocasion) this.elegir.emit(this.ocasion.id);
  }
}

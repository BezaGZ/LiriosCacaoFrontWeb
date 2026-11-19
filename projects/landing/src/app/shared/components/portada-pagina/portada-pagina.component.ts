import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface FotoPortada {
  readonly src: string;
  readonly alt: string;
  /**
   * Que parte de la foto tiene que sobrevivir al recorte, como object-position.
   *
   * La portada es una franja muy ancha y muy baja, asi que de una foto vertical
   * se queda con la banda del medio. En el jardin esa banda es el techo: sin
   * esto, la portada de "un jardin propio" ensena lamina.
   */
  readonly enfoque?: string;
}

/**
 * El encabezado de una pagina interior.
 *
 * Va centrado y con miga de pan debajo, a diferencia de la portada principal,
 * donde el titular se recuesta abajo a la izquierda. Es mas formal, y la miga
 * deja claro en que parte del sitio esta parado el visitante.
 *
 * La foto NO lleva animacion de entrada: es el elemento mas grande de la
 * pagina y por tanto el que mide el LCP. Aparecer desvanecida retrasa esa
 * marca aunque la foto ya este descargada.
 */
@Component({
  selector: 'lc-portada-pagina',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './portada-pagina.component.html',
  styleUrl: './portada-pagina.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortadaPaginaComponent {
  readonly kicker = input.required<string>();
  readonly titulo = input.required<string>();
  readonly foto = input.required<FotoPortada>();
  /** Como se llama esta pagina en la miga de pan. */
  readonly miga = input.required<string>();
}

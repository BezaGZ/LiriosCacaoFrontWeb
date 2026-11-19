import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { NAVEGACION, NEGOCIO } from '../../contenido/sitio';

/**
 * Barra superior. Va ENCIMA de la fotografia de portada, sin fondo propio.
 *
 * El contraste no lo da la barra: lo da el velo superior que cada portada
 * pinta sobre su foto. Una pagina sin foto arriba necesitaria su propio fondo
 * oscuro, o esta barra no se leeria.
 *
 * De 64rem hacia arriba los enlaces van a la vista y la hamburguesa
 * desaparece: esconder la navegacion cuesta visitas a lo que se esconde, y en
 * escritorio no hay razon para pagar ese precio. Abajo de eso manda la
 * hamburguesa, que ahi si hace falta.
 *
 * "Pedir en linea" nunca se esconde, en ningun tamano: es el enlace que cobra.
 */
@Component({
  selector: 'lc-encabezado',
  imports: [RouterLink, RouterLinkActive, MenuComponent],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncabezadoComponent {
  protected readonly negocio = NEGOCIO;
  protected readonly navegacion = NAVEGACION;
  protected readonly abierto = signal(false);

  private readonly disparador =
    viewChild.required<ElementRef<HTMLButtonElement>>('disparador');

  protected alternar(): void {
    this.abierto.update((v) => !v);
    this.bloquearFondo(this.abierto());
  }

  protected cerrar(): void {
    if (!this.abierto()) return;
    this.abierto.set(false);
    this.bloquearFondo(false);
    // El foco vuelve de donde salio: si no, el teclado queda perdido al final
    // del documento.
    this.disparador().nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  protected alEscape(): void {
    this.cerrar();
  }

  /** Evita que la pagina de atras se desplace con el menu abierto. */
  private bloquearFondo(bloquear: boolean): void {
    document.body.classList.toggle('lc-sin-scroll', bloquear);
  }
}

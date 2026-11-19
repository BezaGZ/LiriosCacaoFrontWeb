import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAVEGACION, NEGOCIO, REDES } from '../../contenido/sitio';

/**
 * El menu a pantalla completa que abre la barra superior.
 *
 * Cuando esta cerrado lleva `inert`, no solo `hidden`: asi el teclado y los
 * lectores de pantalla tampoco lo recorren. Esconder algo a la vista pero
 * dejarlo navegable es de los errores de accesibilidad mas comunes.
 */
@Component({
  selector: 'lc-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly abierto = input.required<boolean>();
  readonly cerrar = output<void>();

  protected readonly navegacion = NAVEGACION;
  protected readonly redes = REDES;
  protected readonly negocio = NEGOCIO;

  private readonly botonCerrar =
    viewChild<ElementRef<HTMLButtonElement>>('botonCerrar');

  constructor() {
    effect(() => {
      if (!this.abierto()) return;
      // Al abrir, el foco entra al panel. Sin esto el teclado se queda atras,
      // en la pagina que el menu acaba de tapar.
      queueMicrotask(() => this.botonCerrar()?.nativeElement.focus());
    });
  }
}

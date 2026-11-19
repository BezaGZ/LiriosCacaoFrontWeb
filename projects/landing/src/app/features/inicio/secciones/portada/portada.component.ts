import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PORTADA } from '../../../../contenido/sitio';

/**
 * La portada.
 *
 * Usa <picture> y no NgOptimizedImage a proposito: en escritorio y en telefono
 * van fotos DISTINTAS, no la misma en dos tamanos. Eso es direccion de arte, y
 * NgOptimizedImage no la cubre. De la segunda seccion en adelante, donde la
 * foto si es la misma, ahi si se usa NgOptimizedImage.
 *
 * La foto lleva fetchpriority alto porque es el elemento mas grande de la
 * primera pantalla: es lo que mide el navegador para decidir si la pagina
 * "cargo rapido".
 */
@Component({
  selector: 'lc-portada',
  imports: [RouterLink],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortadaComponent {
  protected readonly c = PORTADA;
}

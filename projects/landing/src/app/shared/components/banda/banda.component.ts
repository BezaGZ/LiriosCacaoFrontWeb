import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RevelarDirective } from '../../directives/revelar.directive';
import { FotoDirective } from '../../directives/foto.directive';
import { Acento } from '../cierre/cierre.component';

export interface FotoBanda {
  readonly src: string;
  readonly alt: string;
  /** object-position, para fotos donde el centro no es lo que importa. */
  readonly enfoque?: string;
}

export interface Enlace {
  readonly texto: string;
  readonly ruta: string;
}

/** Un par rótulo-valor de la lista compacta: "Personas · Hasta 150". */
export interface DatoBanda {
  readonly rotulo: string;
  readonly valor: string;
}

/**
 * Una franja de la portada: foto a un lado, texto al otro.
 *
 * Usa NgOptimizedImage, a diferencia de la portada principal: la foto es la
 * misma en todos los tamanos y solo cambia cuanta resolucion hace falta. Eso
 * le deja a Angular generar el srcset, diferir la carga y reservar el espacio
 * para que la pagina no brinque al bajar.
 */
@Component({
  selector: 'lc-banda',
  imports: [NgOptimizedImage, RouterLink, RevelarDirective, FotoDirective],
  templateUrl: './banda.component.html',
  styleUrl: './banda.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"acento-" + acento() + (invertida() ? " invertida" : "")' },
})
export class BandaComponent {
  readonly kicker = input.required<string>();
  readonly titulo = input.required<string>();
  readonly parrafos = input.required<readonly string[]>();
  readonly enlace = input.required<Enlace>();
  readonly foto = input.required<FotoBanda>();
  readonly acento = input<Acento>('flor');
  /** Pone la foto a la derecha. Alternarlas evita el efecto de catálogo. */
  readonly invertida = input(false);
  readonly datos = input<readonly DatoBanda[]>([]);
}

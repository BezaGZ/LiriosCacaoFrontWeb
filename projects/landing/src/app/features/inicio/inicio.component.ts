import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PortadaComponent } from './secciones/portada/portada.component';
import { DeclaracionComponent } from './secciones/declaracion/declaracion.component';

/**
 * La portada del sitio.
 *
 * A proposito no tiene plantilla propia mas alla de una lista de secciones:
 * cada franja de la pagina es su propio componente, asi reordenarlas es mover
 * una linea y ninguna seccion sabe de las demas.
 */
@Component({
  selector: 'lc-inicio',
  imports: [PortadaComponent, DeclaracionComponent],
  templateUrl: './inicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent {}

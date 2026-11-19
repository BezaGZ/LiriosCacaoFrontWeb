import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NEGOCIO, PIE, REDES } from '../../contenido/sitio';

@Component({
  selector: 'lc-pie',
  imports: [RouterLink],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieComponent {
  protected readonly negocio = NEGOCIO;
  protected readonly redes = REDES;
  protected readonly pie = PIE;
  protected readonly anio = new Date().getFullYear();
}

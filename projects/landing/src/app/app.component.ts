import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EncabezadoComponent } from './layout/encabezado/encabezado.component';
import { PieComponent } from './layout/pie/pie.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EncabezadoComponent, PieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

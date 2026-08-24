import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Portada del inicio.
 *
 * Ya no necesita Router ni metodos de navegacion: los dos botones son enlaces
 * <a routerLink>. Antes eran <button (click)> que llamaban al Router a mano,
 * con lo que Google no podia seguirlos y no se podian abrir en pestana nueva.
 *
 * Tambien se quita ButtonModule de PrimeNG: estaba importado pero no se usaba
 * ningun p-button, los botones son <a> con clases de Tailwind.
 */
@Component({
  selector: 'app-homewelcome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './homewelcome.component.html',
})
export class HomewelcomeComponent {}

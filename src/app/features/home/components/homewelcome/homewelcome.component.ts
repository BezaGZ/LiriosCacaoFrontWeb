import { Component } from '@angular/core';
import {Button, ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homewelcome',
  imports: [
    ButtonModule
  ],
  templateUrl: './homewelcome.component.html',
  styleUrl: './homewelcome.component.scss'
})
export class HomewelcomeComponent {
  constructor(private router: Router) {}

  irSobreNosotros() {
    this.router.navigate(['/sobrenosotros']);
  }

  /**
   * Navega a la página de listado de productos y aplica un filtro de categoría.
   * @param category El ID de la categoría a filtrar (ej: 'chocofruta', 'helado')
   */
  goToCategory(category: string) {
    // La ruta a la que navegamos es la de tu productos
    // El segundo argumento son las opciones, donde pasamos los queryParams
    this.router.navigate(['/productos'], {
      queryParams: { category: category }
    });
  }

}

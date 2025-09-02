import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../cart/cart.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
    // ¡Solo los módulos que el HTML realmente usa!
  ],
  templateUrl: './app.topbar.html',
})
export class AppTopbar {
  readonly router = inject(Router);
  readonly cart = inject(CartService);

  /**
   * Navega a la página de inicio.
   */
  irInicio() {
    this.router.navigate(['/']);
  }

  /**
   * Abre el sidebar del carrito llamando al servicio.
   */
  showCart() {
    this.cart.open();
  }

  /**
   * Obtiene la cantidad total de ítems del carrito para mostrarla en la "burbuja".
   */
  get cartItemCount(): number {
    return this.cart.count;
  }

  /**
   * Formatea el número de ítems para la UI (ej: muestra "99+").
   */
  mostrarCantidadCarrito(): string {
    const cnt = this.cartItemCount;
    return cnt > 99 ? '99+' : String(cnt);
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

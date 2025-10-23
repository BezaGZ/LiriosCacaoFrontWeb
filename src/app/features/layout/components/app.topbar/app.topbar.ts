import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '@features/cart/cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.topbar.html',
})
export class AppTopbar {
  readonly router = inject(Router);
  readonly cart = inject(CartService);

  currentCategory: string | null = null;
  isHome = false;

  constructor() {
    // Detectar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveState();
    });

    // Inicializar estado
    this.updateActiveState();
  }

  /**
   * Actualiza el estado de qué sección está activa
   */
  private updateActiveState() {
    const url = this.router.url;
    const urlTree = this.router.parseUrl(url);
    const path = urlTree.root.children['primary']?.segments[0]?.path;

    this.isHome = !path || path === '';

    // Si estamos en /productos, obtenemos la categoría del queryParam
    if (path === 'productos') {
      this.currentCategory = urlTree.queryParams['category'] || null;
    } else {
      this.currentCategory = null;
    }
  }

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

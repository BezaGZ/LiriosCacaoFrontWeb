import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '@features/cart/cart.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface CategoriaNav {
  id: string;
  nombre: string;
  /** nombre del archivo en assets/icons, sin extension */
  icono: string;
  /**
   * Ruta propia, para las secciones que ya no son un filtro del catalogo.
   * Si no viene, la entrada apunta a /productos?category=<id>.
   */
  ruta?: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.topbar.html',
  // La burbuja con la cantidad del carrito depende de localStorage, que en el
  // servidor no existe: el HTML prerenderizado nunca la trae. Sin esto, un
  // visitante con carrito guardado provoca un desajuste al hidratar.
  host: { 'ngSkipHydration': 'true' },
})
export class AppTopbar implements OnDestroy {
  readonly router = inject(Router);
  readonly cart = inject(CartService);

  /**
   * Las categorias del menu. Antes cada una estaba escrita a mano dos veces
   * (barra de escritorio y barra movil), con iconos y textos duplicados.
   */
  readonly categorias: CategoriaNav[] = [
    { id: 'chocofruta', nombre: 'Chocofrutas', icono: 'chocofruta' },
    { id: 'helado',     nombre: 'Helados',     icono: 'helados' },
    { id: 'flor',       nombre: 'Floristería', icono: 'floristeria', ruta: '/floristeria' },
    { id: 'evento',     nombre: 'Eventos',     icono: 'eventos', ruta: '/eventos' },
  ];

  currentCategory: string | null = null;
  currentPath: string | null = null;
  isHome = false;
  isCart = false;

  private readonly sub: Subscription;

  constructor() {
    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateActiveState());

    this.updateActiveState();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** Marca que seccion esta activa, para la rayita de abajo. */
  private updateActiveState(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    const path = urlTree.root.children['primary']?.segments[0]?.path;

    this.currentPath = path ?? null;
    this.isHome = !path;
    this.isCart = path === 'carrito';
    this.currentCategory = path === 'productos'
      ? (urlTree.queryParams['category'] || null)
      : null;
  }

  /**
   * Una entrada esta activa por su ruta propia (Eventos) o por el filtro
   * del catalogo (el resto).
   */
  esActiva(cat: CategoriaNav): boolean {
    return cat.ruta
      ? cat.ruta === '/' + (this.currentPath ?? '')
      : this.currentCategory === cat.id;
  }

  /** A donde apunta cada entrada del menu. */
  enlaceDe(cat: CategoriaNav): string {
    return cat.ruta ?? '/productos';
  }

  parametrosDe(cat: CategoriaNav): Record<string, string> {
    return cat.ruta ? {} : { category: cat.id };
  }

  get cartItemCount(): number {
    return this.cart.count;
  }

  /** Muestra "99+" cuando se pasa de 99, para que no rompa la burbuja. */
  mostrarCantidadCarrito(): string {
    const cnt = this.cartItemCount;
    return cnt > 99 ? '99+' : String(cnt);
  }
}

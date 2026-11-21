import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '@features/cart/cart.service';
import { Icono } from '@ui/icono/icono';

/** Una pestaña de la barra inferior. */
interface Pestana {
  readonly ruta: string;
  readonly texto: string;
  /** Nombre del icono; el dibujo vive en la plantilla. */
  readonly icono: 'inicio' | 'catalogo' | 'carrito';
}

/**
 * El armazón de la aplicación.
 *
 * Lo que hace distinto a esto de un layout de pagina web es una sola cosa: el
 * cromo esta clavado y SOLO el panel del medio se desplaza. En una web el
 * encabezado sube con el contenido; en una app se queda. Esa es la diferencia
 * estructural, y todo lo demas (sombras, transiciones, respuesta al dedo) es
 * decoracion encima de ella.
 *
 * El carrito vive en la barra de abajo y no arriba. En telefono la esquina
 * superior derecha es el punto mas lejos del pulgar, y el carrito es el boton
 * que mas se toca despues de "agregar".
 *
 * `ngSkipHydration` porque la cantidad del carrito sale de localStorage: en el
 * servidor siempre es cero y al hidratar no coincidiria con lo que el
 * navegador ya sabe. Es la misma razon por la que lo lleva el topbar viejo.
 */
@Component({
  selector: 'lc-cascaron',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CurrencyPipe, Icono],
  templateUrl: './cascaron.html',
  styleUrl: './cascaron.scss',
  host: { ngSkipHydration: 'true' },
})
export class Cascaron {
  private readonly router = inject(Router);
  readonly carrito = inject(CartService);

  readonly pestanas: readonly Pestana[] = [
    { ruta: '/', texto: 'Inicio', icono: 'inicio' },
    { ruta: '/productos', texto: 'Catálogo', icono: 'catalogo' },
    { ruta: '/carrito', texto: 'Carrito', icono: 'carrito' },
  ];

  /** La ruta actual, normalizada a '/algo' sin parametros. */
  ruta = '/';

  constructor() {
    this.ruta = this.normalizar(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => (this.ruta = this.normalizar(e.urlAfterRedirects)));
  }

  private normalizar(url: string): string {
    const limpia = url.split(/[?#]/)[0];
    return limpia.length > 1 && limpia.endsWith('/') ? limpia.slice(0, -1) : limpia;
  }

  activa(ruta: string): boolean {
    return ruta === '/' ? this.ruta === '/' : this.ruta.startsWith(ruta);
  }

  get piezas(): number {
    return this.carrito.count;
  }

  get total(): number {
    return this.carrito.total;
  }

  /**
   * La barra de pedido se esconde dentro del propio carrito: ahi el total ya
   * esta a la vista y repetirlo solo roba alto de pantalla.
   */
  get mostrarBarra(): boolean {
    return this.piezas > 0 && !this.activa('/carrito');
  }
}

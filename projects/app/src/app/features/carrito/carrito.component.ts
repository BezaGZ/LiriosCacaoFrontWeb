import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '@features/cart/cart.models';
import { CartService } from '@features/cart/cart.service';
import { Icono } from '@ui/icono/icono';

@Component({
  selector: 'lc-carrito',
  standalone: true,
  imports: [Icono, RouterLink, CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
  /**
   * El HTML prerenderizado sale con el carrito vacío: en el servidor no hay
   * localStorage. Si el visitante trae un carrito guardado, lo que pinta el
   * navegador no coincide con ese HTML, así que esta parte se renderiza de
   * cero en vez de intentar reutilizarlo.
   */
  host: { ngSkipHydration: 'true' },
})
export class CarritoComponent {
  private readonly carrito = inject(CartService);
  private readonly router = inject(Router);

  /** Fuerza un recálculo cuando el servicio cambia. */
  private readonly version = signal(0);

  /** La línea que el dedo está arrastrando, y cuánto lleva corrida. */
  readonly arrastrando = signal<string | null>(null);
  readonly corrimiento = signal(0);

  private inicioX = 0;

  constructor() {
    this.carrito.items$.subscribe(() => this.version.update(n => n + 1));
  }

  readonly items = computed<readonly CartItem[]>(() => {
    this.version();
    return this.carrito.items;
  });

  readonly piezas = computed(() => {
    this.version();
    return this.carrito.count;
  });

  readonly total = computed(() => {
    this.version();
    return this.carrito.total;
  });

  mas(i: CartItem): void { this.carrito.inc(i.id); }
  menos(i: CartItem): void { this.carrito.dec(i.id); }
  quitar(i: CartItem): void { this.carrito.remove(i.id); }

  continuar(): void { this.router.navigate(['/pedido']); }

  // ------------------------------------------------------------ el gesto

  /**
   * Deslizar una línea hacia la izquierda para quitarla.
   *
   * Pasados 96 px se suelta y el producto se va. Debajo de eso la línea
   * vuelve a su sitio, que es lo que evita que un desplazamiento vertical
   * torcido borre algo sin querer.
   *
   * Hay además un botón de quitar visible: el gesto es un atajo, nunca la
   * única forma de hacer algo.
   */
  empezar(e: PointerEvent, i: CartItem): void {
    if (e.pointerType === 'mouse') return;
    this.inicioX = e.clientX;
    this.arrastrando.set(i.id);
    this.corrimiento.set(0);
  }

  mover(e: PointerEvent, i: CartItem): void {
    if (this.arrastrando() !== i.id) return;
    const d = e.clientX - this.inicioX;
    // Solo hacia la izquierda: hacia la derecha no hay nada que hacer.
    this.corrimiento.set(Math.min(0, Math.max(-140, d)));
  }

  soltar(i: CartItem): void {
    if (this.arrastrando() !== i.id) return;
    const corrido = this.corrimiento();
    this.arrastrando.set(null);
    this.corrimiento.set(0);
    if (corrido <= -96) this.quitar(i);
  }

  desplazamiento(i: CartItem): number {
    return this.arrastrando() === i.id ? this.corrimiento() : 0;
  }
}

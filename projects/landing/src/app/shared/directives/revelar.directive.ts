import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Revela un elemento cuando entra en pantalla.
 *
 * Son treinta lineas en lugar de una libreria de animacion de 70 kB, y la
 * transicion la hace CSS, que es lo que mejor sabe hacerla.
 *
 *     <section lcRevelar>...</section>
 *     <article [lcRevelar]="120">...</article>   <!-- con 120 ms de retraso -->
 *
 * Tres cosas que importan:
 *
 *  - En el servidor no hace nada. El HTML sale completo y visible.
 *  - Si el visitante pidio menos movimiento, muestra el elemento de una vez.
 *  - Deja de observar en cuanto revela: no se queda escuchando de gratis.
 */
@Directive({
  selector: '[lcRevelar]',
  host: { class: 'lc-revelar' },
})
export class RevelarDirective implements AfterViewInit, OnDestroy {
  /** Retraso en milisegundos, para escalonar varios elementos de una fila. */
  readonly retraso = input(0, { alias: 'lcRevelar', transform: Number });

  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly render = inject(Renderer2);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private observador?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!this.esNavegador) return;

    const nodo = this.elemento.nativeElement;
    const sinMovimiento =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (sinMovimiento || !('IntersectionObserver' in window)) {
      this.mostrar(nodo);
      return;
    }

    this.observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          this.mostrar(nodo);
          this.observador?.unobserve(nodo);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    this.observador.observe(nodo);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }

  private mostrar(nodo: HTMLElement): void {
    const ms = this.retraso();
    if (ms > 0) {
      this.render.setStyle(nodo, 'transition-delay', `${ms}ms`);
    }
    this.render.addClass(nodo, 'lc-visible');
  }
}

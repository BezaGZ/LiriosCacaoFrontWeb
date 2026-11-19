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
 * Aparecer suave para fotografías.
 *
 *     <img lcFoto [ngSrc]="..." alt="...">
 *     <img [lcFoto]="120" [ngSrc]="..." alt="...">   <!-- con retraso -->
 *
 * Se distingue de `lcRevelar` en una cosa que importa: espera DOS condiciones,
 * que la foto esté en pantalla y que haya terminado de cargar. Una foto que se
 * desvanece mientras todavía está bajando se ve peor que sin efecto ninguno.
 *
 * NO va en la foto de portada de cada página. Esa es el elemento más grande de
 * la primera pantalla, o sea lo que el navegador mide para decidir si la
 * página "cargó rápido". Desvanecerla retrasa justo esa medida.
 *
 * Casos que parecen detalle y no lo son:
 *  - Foto ya en caché: `load` nunca se dispara, así que se revisa `complete`.
 *    Sin esto, volver a una página deja las fotos invisibles para siempre.
 *  - Foto que falla: se trata como cargada, para que al menos salga el texto
 *    alternativo en lugar de un hueco.
 */
@Directive({
  selector: 'img[lcFoto]',
  host: { class: 'lc-foto' },
})
export class FotoDirective implements AfterViewInit, OnDestroy {
  /** Retraso en milisegundos, para escalonar varias fotos de una fila. */
  readonly retraso = input(0, { alias: 'lcFoto', transform: Number });

  private readonly elemento = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private readonly render = inject(Renderer2);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private observador?: IntersectionObserver;
  private quitarEscuchas: Array<() => void> = [];
  private enPantalla = false;
  private cargada = false;
  private mostrada = false;

  ngAfterViewInit(): void {
    if (!this.esNavegador) return;

    const img = this.elemento.nativeElement;
    const sinMovimiento =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (sinMovimiento || !('IntersectionObserver' in window)) {
      this.mostrar();
      return;
    }

    this.vigilarCarga(img);
    this.vigilarPantalla(img);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    for (const quitar of this.quitarEscuchas) quitar();
    this.quitarEscuchas = [];
  }

  private vigilarCarga(img: HTMLImageElement): void {
    // Si venía de la caché, `complete` ya es true y `load` no va a dispararse.
    if (img.complete && img.naturalWidth > 0) {
      this.cargada = true;
      return;
    }

    const listo = () => {
      this.cargada = true;
      this.intentar();
    };

    this.quitarEscuchas.push(
      this.render.listen(img, 'load', listo),
      // Una foto rota no debe dejar un hueco invisible.
      this.render.listen(img, 'error', listo),
    );
  }

  private vigilarPantalla(img: HTMLImageElement): void {
    this.observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          this.enPantalla = true;
          this.observador?.unobserve(img);
          this.intentar();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
    );

    this.observador.observe(img);
  }

  private intentar(): void {
    if (this.enPantalla && this.cargada) this.mostrar();
  }

  private mostrar(): void {
    if (this.mostrada) return;
    this.mostrada = true;

    const ms = this.retraso();
    if (ms > 0) {
      this.render.setStyle(this.elemento.nativeElement, 'transition-delay', `${ms}ms`);
    }
    this.render.addClass(this.elemento.nativeElement, 'lc-visible');
  }
}

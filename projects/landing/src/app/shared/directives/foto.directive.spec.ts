import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoDirective } from './foto.directive';

@Component({
  imports: [FotoDirective],
  template: `<img lcFoto src="a.jpg" alt="a"><img [lcFoto]="200" src="b.jpg" alt="b">`,
})
class Anfitrion {}

describe('FotoDirective', () => {
  let fijo: ComponentFixture<Anfitrion>;
  let ioOriginal: typeof IntersectionObserver;
  let mediaOriginal: typeof window.matchMedia;

  const observadores: { cb: IntersectionObserverCallback; nodos: Element[] }[] = [];

  function entraEnPantalla(nodo: Element): void {
    const obs = observadores.find((o) => o.nodos.includes(nodo));
    obs?.cb(
      [{ isIntersecting: true, target: nodo } as IntersectionObserverEntry],
      null as never,
    );
  }

  function fingirObserver(): void {
    observadores.length = 0;
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      class {
        private readonly reg: { cb: IntersectionObserverCallback; nodos: Element[] };
        constructor(cb: IntersectionObserverCallback) {
          this.reg = { cb, nodos: [] };
          observadores.push(this.reg);
        }
        observe(n: Element) { this.reg.nodos.push(n); }
        unobserve() { /* nada */ }
        disconnect() { /* nada */ }
      };
  }

  function fingirMovimiento(reducido: boolean): void {
    window.matchMedia = ((c: string) =>
      ({ matches: reducido, media: c }) as MediaQueryList) as typeof window.matchMedia;
  }

  function fotos(): HTMLImageElement[] {
    return Array.from((fijo.nativeElement as HTMLElement).querySelectorAll('img'));
  }

  function montar(movimientoReducido = false): void {
    fingirMovimiento(movimientoReducido);
    fingirObserver();
    fijo = TestBed.createComponent(Anfitrion);
    fijo.detectChanges();
  }

  beforeEach(async () => {
    ioOriginal = window.IntersectionObserver;
    mediaOriginal = window.matchMedia;
    await TestBed.configureTestingModule({ imports: [Anfitrion] }).compileComponents();
  });

  afterEach(() => {
    window.IntersectionObserver = ioOriginal;
    window.matchMedia = mediaOriginal;
  });

  it('no muestra la foto solo por estar en pantalla si todavía no cargó', () => {
    montar();
    const [a] = fotos();

    entraEnPantalla(a);

    // Desvanecer una foto a medio bajar se ve peor que no animarla.
    expect(a.classList).not.toContain('lc-visible');
  });

  it('no muestra la foto solo por haber cargado si todavía no está en pantalla', () => {
    montar();
    const [a] = fotos();

    a.dispatchEvent(new Event('load'));

    expect(a.classList).not.toContain('lc-visible');
  });

  it('muestra cuando se cumplen las dos, en cualquier orden', () => {
    montar();
    const [a, b] = fotos();

    a.dispatchEvent(new Event('load'));
    entraEnPantalla(a);
    expect(a.classList).withContext('carga y luego entra').toContain('lc-visible');

    entraEnPantalla(b);
    b.dispatchEvent(new Event('load'));
    expect(b.classList).withContext('entra y luego carga').toContain('lc-visible');
  });

  it('una foto que falla igual se muestra, para que salga el texto alternativo', () => {
    montar();
    const [a] = fotos();

    entraEnPantalla(a);
    a.dispatchEvent(new Event('error'));

    expect(a.classList).toContain('lc-visible');
  });

  it('aplica el retraso solo donde se pidió', () => {
    montar();
    const [a, b] = fotos();

    for (const img of [a, b]) {
      entraEnPantalla(img);
      img.dispatchEvent(new Event('load'));
    }

    expect(a.style.transitionDelay).toBe('');
    expect(b.style.transitionDelay).toBe('200ms');
  });

  it('con menos movimiento se muestra de una vez y no observa nada', () => {
    montar(true);

    for (const img of fotos()) expect(img.classList).toContain('lc-visible');
    expect(observadores.length).toBe(0);
  });
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevelarDirective } from './revelar.directive';

@Component({
  imports: [RevelarDirective],
  template: `<p lcRevelar>uno</p><p [lcRevelar]="120">dos</p>`,
})
class Anfitrion {}

describe('RevelarDirective', () => {
  let fijo: ComponentFixture<Anfitrion>;
  let ioOriginal: typeof IntersectionObserver;
  let mediaOriginal: typeof window.matchMedia;

  /**
   * Cada directiva crea SU propio observador, asi que el falso lleva cuenta de
   * quien observa a quien y se dispara por elemento. Si se comparte uno solo,
   * la prueba miente.
   */
  const observadores: { cb: IntersectionObserverCallback; nodos: Element[] }[] = [];

  function nodosObservados(): Element[] {
    return observadores.flatMap((o) => o.nodos);
  }

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
        private readonly registro: { cb: IntersectionObserverCallback; nodos: Element[] };
        constructor(cb: IntersectionObserverCallback) {
          this.registro = { cb, nodos: [] };
          observadores.push(this.registro);
        }
        observe(n: Element) { this.registro.nodos.push(n); }
        unobserve() { /* nada */ }
        disconnect() { /* nada */ }
      };
  }

  function fingirMovimiento(reducido: boolean): void {
    window.matchMedia = ((consulta: string) =>
      ({ matches: reducido, media: consulta }) as MediaQueryList) as typeof window.matchMedia;
  }

  function parrafos(): HTMLParagraphElement[] {
    return Array.from(
      (fijo.nativeElement as HTMLElement).querySelectorAll('p'),
    );
  }

  function montar(movimientoReducido: boolean): void {
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

  it('marca los elementos y los observa, pero no los revela de entrada', () => {
    montar(false);

    expect(parrafos().length).toBe(2);
    for (const p of parrafos()) {
      expect(p.classList).toContain('lc-revelar');
      expect(p.classList).not.toContain('lc-visible');
    }
    expect(nodosObservados().length).toBe(2);
  });

  it('revela cuando el elemento entra en pantalla', () => {
    montar(false);
    const [uno, dos] = parrafos();

    entraEnPantalla(uno);

    expect(uno.classList).toContain('lc-visible');
    // Y no arrastra al vecino: cada uno aparece cuando le toca.
    expect(dos.classList).not.toContain('lc-visible');
  });

  it('aplica el retraso solo cuando se le pide uno', () => {
    montar(false);
    const [uno, dos] = parrafos();

    entraEnPantalla(uno);
    entraEnPantalla(dos);

    expect(uno.style.transitionDelay).toBe('');
    expect(dos.style.transitionDelay).toBe('120ms');
  });

  it('no espera a nada si el visitante pidio menos movimiento', () => {
    // Hay personas a las que el movimiento al desplazarse les produce mareo.
    // Para ellas el contenido se muestra de una vez y no se observa nada.
    montar(true);

    for (const p of parrafos()) {
      expect(p.classList).toContain('lc-visible');
    }
    expect(nodosObservados().length).toBe(0);
  });
});

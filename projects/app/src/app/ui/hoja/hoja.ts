import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

/**
 * La hoja que se arrastra.
 *
 * Dos posiciones de reposo: `media`, donde deja ver la fotografía, y `alta`,
 * donde la tapa para que quepan más opciones. Se suelta en la más cercana, y
 * tirando hacia abajo desde la media se cierra.
 *
 * Por qué posiciones de reposo y no libre: una hoja que se queda donde la
 * dejaron se ve rota a los tres usos. Las dos posiciones son las que hacen
 * que el gesto se sienta de app y no de página con JavaScript encima.
 *
 * El gesto solo arranca desde el asa o cuando el contenido está hasta
 * arriba. Si no, arrastrar para leer cerraría la hoja, que es el error
 * clásico de este patrón.
 */
@Directive({
  selector: '[lcHoja]',
  standalone: true,
})
export class Hoja {
  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Píxeles desde arriba en cada posición de reposo. */
  readonly media = input(226);
  readonly alta = input(44);

  /** Cuánto hay que tirar hacia abajo desde la media para que se cierre. */
  readonly umbralCierre = input(120);

  readonly cerrar = output<void>();

  private posicion: 'media' | 'alta' = 'media';
  private arrastrando = false;
  private punteroY = 0;
  private partida = 0;
  private actual = 0;

  private get el(): HTMLElement {
    return this.anfitrion.nativeElement;
  }

  @HostListener('pointerdown', ['$event'])
  empezar(e: PointerEvent): void {
    // Con ratón no hay gesto: en escritorio la hoja se queda quieta.
    if (e.pointerType === 'mouse') return;

    const destino = e.target as HTMLElement;
    const desdeAsa = !!destino.closest('[data-asa]');
    const cuerpo = this.el.querySelector<HTMLElement>('[data-desplazable]');
    const arriba = !cuerpo || cuerpo.scrollTop <= 0;

    // Desde el cuerpo solo si ya está hasta arriba, para no robarle el
    // desplazamiento a quien está leyendo las opciones.
    if (!desdeAsa && !arriba) return;

    this.arrastrando = true;
    this.punteroY = e.clientY;
    this.partida = this.posicion === 'alta' ? this.alta() : this.media();
    this.actual = this.partida;
    this.el.style.transition = 'none';
    this.el.setPointerCapture?.(e.pointerId);
  }

  @HostListener('pointermove', ['$event'])
  mover(e: PointerEvent): void {
    if (!this.arrastrando) return;

    const desplazado = e.clientY - this.punteroY;

    // Hacia arriba no pasa de la posición alta, y pasado el tope se frena:
    // sin eso la hoja se despega del borde y se ve suelta.
    const crudo = this.partida + desplazado;
    this.actual = crudo < this.alta()
      ? this.alta() - (this.alta() - crudo) * 0.25
      : crudo;

    this.el.style.setProperty('--hoja-top', `${this.actual}px`);

    // Mientras la hoja se mueve, el navegador no debe desplazar la página.
    if (Math.abs(desplazado) > 4) e.preventDefault();
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  soltar(e: PointerEvent): void {
    if (!this.arrastrando) return;
    this.arrastrando = false;
    this.el.releasePointerCapture?.(e.pointerId);
    this.el.style.transition = '';

    // Tirar hacia abajo lo suficiente cierra, venga de donde venga.
    if (this.actual > this.media() + this.umbralCierre()) {
      this.cerrar.emit();
      return;
    }

    // Si no, cae en la posición de reposo más cercana.
    const aAlta = Math.abs(this.actual - this.alta());
    const aMedia = Math.abs(this.actual - this.media());
    this.ir(aAlta < aMedia ? 'alta' : 'media');
  }

  /** Tocar el asa alterna entre las dos posiciones, sin arrastrar. */
  @HostListener('click', ['$event'])
  alternar(e: MouseEvent): void {
    const destino = e.target as HTMLElement;
    if (!destino.closest('[data-asa]')) return;
    this.ir(this.posicion === 'media' ? 'alta' : 'media');
  }

  private ir(a: 'media' | 'alta'): void {
    this.posicion = a;
    this.actual = a === 'alta' ? this.alta() : this.media();
    this.el.style.setProperty('--hoja-top', `${this.actual}px`);
  }
}

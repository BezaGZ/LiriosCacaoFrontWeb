import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * El juego de iconos de la aplicación.
 *
 * SVG de trazo escritos en la plantilla, no una tipografía de iconos: pesan
 * menos que cargar primeicons entero, toman `currentColor` sin pelearse con
 * nada, y al ser trazo se ven igual de nítidos a 16 px que a 40.
 *
 * Van literales y no por `innerHTML` con un diccionario, que seria mas corto:
 * el sanitizador de Angular recorta SVG inyectado y además `innerHTML` sobre
 * un `<svg>` no funciona igual al renderizar en el servidor. Mas largo aqui,
 * pero sin sorpresas.
 *
 * Las categorías llevan icono y no fotografía recortada. Una foto de producto
 * dentro de un disco de 66 px se vuelve una mancha, y encima ataría la
 * categoría a que ese producto tenga foto.
 */
export type NombreIcono =
  | 'inicio' | 'catalogo' | 'carrito' | 'lupa' | 'mas' | 'menos' | 'atras'
  | 'pin' | 'abajo' | 'check' | 'camion' | 'whatsapp' | 'copiar'
  | 'chocofruta' | 'helado' | 'bebida' | 'paquete' | 'comida';

@Component({
  selector: 'lc-icono',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="tamano()"
      [attr.height]="tamano()"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="grosor()"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (nombre()) {
        @case ('inicio') {
          <path d="M3.5 10.5 12 3.5l8.5 7" /><path d="M5.5 12v8.5h13V12" />
        }
        @case ('catalogo') {
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
        }
        @case ('carrito') {
          <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L20.5 8H6" />
          <circle cx="9.5" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" />
        }
        @case ('lupa') {
          <circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" />
        }
        @case ('mas') { <path d="M12 5v14M5 12h14" /> }
        @case ('menos') { <path d="M5 12h14" /> }
        @case ('atras') { <path d="M14.5 5 8 12l6.5 7" /> }
        @case ('pin') {
          <path d="M12 21.5s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10.5" r="2.6" />
        }
        @case ('abajo') { <path d="M6 9.5 12 15.5 18 9.5" /> }
        @case ('check') { <path d="M5 12.5 10 17.5 19 7" /> }
        @case ('camion') {
          <path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5h3.5l3.5 3.5v2.5h-7z" />
          <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
        }
        @case ('whatsapp') { <path d="M3.5 20.5 5 16a8 8 0 1 1 3 3z" /> }
        @case ('copiar') {
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M4 16V5a1 1 0 0 1 1-1h11" />
        }

        <!-- Una fruta bañada: el borde del chocolate marcado y el palito abajo -->
        @case ('chocofruta') {
          <path d="M12 3.2c3 0 4.8 2.2 4.8 5.3 0 3.4-2.2 6.6-4.8 6.6S7.2 11.9 7.2 8.5C7.2 5.4 9 3.2 12 3.2z" />
          <path d="M8 10.4c1.2.9 2.5 1.3 4 1.3s2.8-.4 4-1.3" /><path d="M12 15.1V21" />
        }
        <!-- Paleta rectangular con palito plano -->
        @case ('helado') {
          <rect x="7.5" y="2.8" width="9" height="12.4" rx="3" />
          <path d="M12 15.2V21" /><path d="M10.6 21h2.8" />
        }
        <!-- El vaso de 16 oz con su tapa domo -->
        @case ('bebida') {
          <path d="M6.8 9h10.4l-1.1 10.2a2 2 0 0 1-2 1.8h-4.2a2 2 0 0 1-2-1.8z" />
          <path d="M6 9a6 6 0 0 1 12 0" /><path d="M12 3v2.2" />
        }
        @case ('paquete') {
          <path d="M4 9.5h16V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path d="M3 5.5h18v4H3z" /><path d="M12 5.5V21" />
        }
        @case ('comida') {
          <path d="M7 3v7a2.5 2.5 0 0 0 5 0V3" /><path d="M9.5 10v11" />
          <path d="M17 3c-1.5 1.6-2 3.1-2 5.1s.5 3.1 2 3.1 2-1.1 2-3.1-.5-3.5-2-5.1z" />
          <path d="M17 11.2V21" />
        }
      }
    </svg>
  `,
  styles: [':host { display: inline-flex; line-height: 0 }'],
})
export class Icono {
  readonly nombre = input.required<NombreIcono>();
  readonly tamano = input(20);
  readonly grosor = input(1.8);
}

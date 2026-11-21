import { CurrencyPipe, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { abrirWhatsApp } from '@core/config/contacto.config';
import {
  DatosEntrega, ENVIO_DOMICILIO, FormaPago, ModoEntrega, Momento,
  guardarEntrega, leerEntrega, olvidarEntrega,
} from '@core/pedido/pedido.datos';
import { armarMensaje, faltaPara, ResumenPedido } from '@core/pedido/pedido.mensaje';
import { CartService } from '@features/cart/cart.service';
import { Icono } from '@ui/icono/icono';

@Component({
  selector: 'lc-pedido',
  standalone: true,
  imports: [Icono, CurrencyPipe],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss',
  host: { ngSkipHydration: 'true' },
})
export class PedidoComponent {
  private readonly carrito = inject(CartService);
  private readonly router = inject(Router);
  private readonly ubicacion = inject(Location);

  readonly datos = signal<DatosEntrega>(leerEntrega());
  readonly copiado = signal(false);
  readonly verMensaje = signal(false);

  /** Para la pista que va junto al selector de entrega. */
  readonly envioDomicilio = ENVIO_DOMICILIO;
  private readonly version = signal(0);

  constructor() {
    this.carrito.items$.subscribe(() => this.version.update(n => n + 1));
  }

  readonly items = computed(() => { this.version(); return this.carrito.items; });
  readonly piezas = computed(() => { this.version(); return this.carrito.count; });
  readonly subtotal = computed(() => { this.version(); return this.carrito.total; });

  readonly envio = computed(() =>
    this.datos().entrega === 'domicilio' && this.items().length ? ENVIO_DOMICILIO : 0);

  readonly total = computed(() => this.subtotal() + this.envio());

  readonly resumen = computed<ResumenPedido>(() => ({
    items: this.items(),
    subtotal: this.subtotal(),
    envio: this.envio(),
    total: this.total(),
    datos: this.datos(),
  }));

  readonly mensaje = computed(() => armarMensaje(this.resumen()));
  readonly falta = computed(() => faltaPara(this.resumen()));

  /**
   * El mensaje partido para mostrarlo.
   *
   * WhatsApp marca la negrita con asteriscos. Mandarlos es correcto;
   * enseñarlos no: al cliente le parecen texto roto. Se parte en tramos y la
   * plantilla pinta en negrita los impares. Nada de innerHTML, que obliga a
   * saltarse el saneador por un formato de dos caracteres.
   */
  readonly vista = computed<readonly { texto: string; fuerte: boolean }[]>(() =>
    this.mensaje()
      .split('*')
      .map((texto, i) => ({ texto, fuerte: i % 2 === 1 }))
      .filter(t => t.texto !== ''));

  /**
   * Si hay algo que borrar.
   *
   * El aviso solo aparece cuando ya hay datos escritos. Un boton fijo de
   * borrar al pie compite con Enviar, y nadie llega a esta pantalla
   * queriendo borrar: llega queriendo pedir.
   */
  readonly hayGuardado = computed(() => {
    const d = this.datos();
    return d.nombre.trim() !== '' || d.direccion.trim() !== '';
  });

  // ------------------------------------------------------------- edición

  /**
   * Cada cambio se guarda al momento, no al enviar.
   *
   * Quien cierra la app a medio pedido vuelve y encuentra su dirección
   * escrita. Es entrega a domicilio: la dirección es lo único que el cliente
   * tiene que teclear, y es lo más caro de pedir dos veces.
   */
  private cambiar(parche: Partial<DatosEntrega>): void {
    const nuevos = { ...this.datos(), ...parche };
    this.datos.set(nuevos);
    this.copiado.set(false);
    guardarEntrega(nuevos);
  }

  nombre(v: string): void { this.cambiar({ nombre: v }); }
  direccion(v: string): void { this.cambiar({ direccion: v }); }
  entrega(v: ModoEntrega): void { this.cambiar({ entrega: v }); }
  pago(v: FormaPago): void { this.cambiar({ pago: v }); }
  momento(v: Momento): void { this.cambiar({ momento: v }); }

  cambio(v: string): void {
    const n = Number.parseFloat(v);
    this.cambiar({ cambio: Number.isFinite(n) ? n : null });
  }

  volver(): void { this.ubicacion.back(); }

  alternarMensaje(): void { this.verMensaje.update(v => !v); }

  // -------------------------------------------------------------- envío

  async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.mensaje());
      this.copiado.set(true);
    } catch {
      // Algunos navegadores lo niegan sin aviso. El mensaje está a la vista
      // y se puede seleccionar a mano, así que no hay nada que avisar.
    }
  }

  enviar(): void {
    if (this.falta()) return;
    abrirWhatsApp(this.mensaje());

    // El carrito se vacía pero los datos de entrega NO: el siguiente pedido
    // va a la misma casa y a nombre de la misma persona.
    this.carrito.clear();
    this.router.navigate(['/']);
  }

  /** Para cuando el cliente quiere borrar lo guardado en su telefono. */
  olvidar(): void {
    olvidarEntrega();
    this.datos.set(leerEntrega());
  }
}

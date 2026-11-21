import { CurrencyPipe, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { abrirWhatsApp } from '@core/config/contacto.config';
import {
  DatosEntrega, FormaPago, ModoEntrega, Momento,
  guardarEntrega, leerEntrega, olvidarEntrega,
} from '@core/pedido/pedido.datos';
import { armarMensaje, faltaPara, ResumenPedido } from '@core/pedido/pedido.mensaje';
import { CartService } from '@features/cart/cart.service';
import { Icono } from '@ui/icono/icono';

/** Lo que cuesta llevarlo. Es un número del negocio, no del código. */
const ENVIO_DOMICILIO = 7;

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

  /** Para cuando el cliente quiere borrar lo guardado. */
  olvidar(): void {
    olvidarEntrega();
    this.datos.set(leerEntrega());
  }
}

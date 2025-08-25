import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';   // 👈 nuevo
import { CartService } from '../../../cart/cart.service';
import { CartItem } from '../../../cart/cart.models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule, CommonModule, MenuModule, ButtonModule,
    DividerModule, MenubarModule, DialogModule,
    SidebarModule, FormsModule, InputTextModule, InputNumberModule
  ],
  templateUrl: './app.topbar.html',
})
export class AppTopbar {
  readonly router = inject(Router);
  readonly cart = inject(CartService);

  entrega: 'domicilio' | 'local' = 'domicilio';
  pago: 'efectivo' | 'tarjeta' = 'efectivo';
  direccion = '';
  cambio: number | null = null;       // 👈 nuevo

  telefonoWhats = '50230625215';

  irInicio() { this.router.navigate(['/']); }

  get cartItemCount(): number { return this.cart.count; }
  mostrarCantidadCarrito(): string {
    const cnt = this.cartItemCount;
    return cnt > 99 ? '99+' : String(cnt);
  }

  // ---- Totales y fees ----
  get subtotal(): number {
    return this.cart.total; // suma de items
  }
  get deliveryFee(): number {
    return this.entrega === 'domicilio' ? 5 : 0; // Q5 a domicilio
  }
  get appFee(): number {
    return 2; // Q2 siempre
  }
  get grandTotal(): number {
    return this.subtotal + this.deliveryFee + this.appFee;
  }

  checkoutWhatsApp() {
    if (this.entrega === 'domicilio' && !this.direccion.trim()) {
      alert('Por favor, ingresa una dirección para la entrega a domicilio.');
      return;
    }

    const q = (n: number) => `Q${n.toFixed(2)}`;
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1) Encabezado
    const header = [
      '*Pedido nuevo*',
      `Fecha: ${fecha}`,
      `Hora: ${hora}`,
      '-----------------------------'
    ].join('\n');

    // 2) Productos
    const items = this.cart.items.map((i, idx) =>
      `${idx + 1}. ${i.title} - Cant: ${i.qty} · Unit: ${q(i.unitPrice)} · Total: ${q(i.unitPrice * i.qty)}`
    ).join('\n');
    const itemsBlock = `Productos:\n${items || '— Sin productos —'}`;

    // 3) Resumen
    const resumen = [
      '-----------------------------',
      'Resumen:',
      `Subtotal: ${q(this.subtotal)}`,
      ...(this.deliveryFee > 0 ? [`Envío: ${q(this.deliveryFee)}`] : []),
      `Fee app: ${q(this.appFee)}`,
      `TOTAL: ${q(this.grandTotal)}`
    ].join('\n');

    // 4) Detalles de entrega y pago
    const entregaTxt = this.entrega === 'domicilio' ? 'A domicilio' : 'Recoger en local';
    const pagoTxt    = this.pago === 'tarjeta' ? 'Tarjeta' : 'Efectivo';
    const dirTxt     = this.entrega === 'domicilio' ? `Dirección: ${this.direccion.trim()}` : '';
    const cambioTxt  = (this.pago === 'efectivo' && this.cambio != null && !Number.isNaN(this.cambio))
      ? `Cambio con: ${q(this.cambio)}`
      : '';

    const detalles = [
      '-----------------------------',
      'Detalles:',
      `Entrega: ${entregaTxt}`,
      `Pago: ${pagoTxt}`,
      dirTxt,
      cambioTxt
    ].filter(Boolean).join('\n');

    // Mensaje final que el cliente te envía a ti
    const plain = [header, itemsBlock, resumen, detalles].join('\n\n');

    const url = `https://wa.me/${this.telefonoWhats}?text=${encodeURIComponent(plain)}`;
    window.open(url, '_blank');
  }

  inc(i: CartItem) { this.cart.inc(i.id); }
  dec(i: CartItem) { this.cart.dec(i.id); }
  remove(i: CartItem) { this.cart.remove(i.id); }

  sidebarVisible = false;
  ngOnInit() { this.cart.sidebarVisible$.subscribe(v => (this.sidebarVisible = !!v)); }
  showCart() { this.cart.open(); }
  onSidebarVisibleChange(v: boolean) { v ? this.cart.open() : this.cart.close(); }
}

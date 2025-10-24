import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {RadioButton} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {Dialog} from "primeng/dialog";
import {Router} from '@angular/router';
import {CartService} from '@features/cart/cart.service';
import {CartItem} from '@features/cart/cart.models';
import {CHOCOFRUTA_SEED} from '@core/domain';

@Component({
  selector: 'app-cart',
  imports: [
    AsyncPipe,
    DecimalPipe,
    InputNumber,
    InputText,
    NgForOf,
    NgIf,
    PrimeTemplate,
    RadioButton,
    Dialog,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  readonly router = inject(Router);
  readonly cart = inject(CartService);

  entrega: 'domicilio' | 'local' = 'domicilio';
  pago: 'efectivo' | 'tarjeta' = 'efectivo';
  direccion = '';
  cambio: number | null = null;       // 👈 nuevo

  telefonoWhats = '45827110';

  get cartItemCount(): number { return this.cart.count; }
  mostrarCantidadCarrito(): string {
    const cnt = this.cartItemCount;
    return cnt > 99 ? '99+' : String(cnt);
  }

  get subtotal(): number {
    return this.cart.total;
  }
  get deliveryFee(): number {
    return this.entrega === 'domicilio' ? 7 : 0;
  }
  get appFee(): number {
    return 0;
  }
  get grandTotal(): number {
    return this.subtotal + this.deliveryFee;
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

    const header = [
      '*Pedido nuevo*',
      `Fecha: ${fecha}`,
      `Hora: ${hora}`,
      '-----------------------------'
    ].join('\n');

    const items = this.cart.items.map((i, idx) => {
      const lines = [`*${idx + 1}. ${i.title}*`];

      // Agregar detalles si existen (para chocofrutas y helados)
      if (i.data?.chocofruta) {
        const cf = i.data.chocofruta;
        lines.push(`   Fruta: ${cf.fruta.nombre}`);
        lines.push(`   Chocolate: ${cf.chocolate.nombre}`);
        if (cf.toppings && cf.toppings.length > 0) {
          const toppingsText = cf.toppings.map((t: any) => {
            // Si es líneas de chocolate y tiene sabor, mostrarlo
            if (t.id === 'top_lineaschocolate' && cf.lineasChocolateSlug) {
              const chocLineas = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === cf.lineasChocolateSlug);
              return chocLineas ? `Líneas de chocolate ${chocLineas.nombre}` : t.nombre;
            }
            return t.nombre;
          }).join(', ');
          lines.push(`   Toppings: ${toppingsText}`);
        }
        if (cf.dobleChocolate) {
          lines.push(`   Extra: Doble chocolate`);
        }
      } else if (i.data?.helado) {
        const h = i.data.helado;
        lines.push(`   Sabor: ${h.sabor.nombre}`);
        if (h.chocolate) {
          lines.push(`   Chocolate: ${h.chocolate.nombre}`);
        }
        if (h.toppings && h.toppings.length > 0) {
          const toppingsText = h.toppings.map((t: any) => {
            if (t.id === 'top_lineaschocolate' && h.lineasChocolateSlug) {
              const chocLineas = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === h.lineasChocolateSlug);
              return chocLineas ? `Líneas de chocolate ${chocLineas.nombre}` : t.nombre;
            }
            return t.nombre;
          }).join(', ');
          lines.push(`   Toppings: ${toppingsText}`);
        }
        if (h.chocolateExtra) {
          lines.push(`   Extra: Chocolate extra`);
        }
      }

      lines.push(`   Cantidad: ${i.qty} · Precio unit: ${q(i.unitPrice)}`);
      lines.push(`   Subtotal: ${q(i.unitPrice * i.qty)}`);

      return lines.join('\n');
    }).join('\n\n');
    const itemsBlock = `*Productos:*\n\n${items || '— Sin productos —'}`;

    const resumen = [
      '-----------------------------',
      'Resumen:',
      `Subtotal: ${q(this.subtotal)}`,
      ...(this.deliveryFee > 0 ? [`Envío: ${q(this.deliveryFee)}`] : []),
      ...(this.appFee > 0 ? [`Fee app: ${q(this.appFee)}`] : []),
      `TOTAL: ${q(this.grandTotal)}`
    ].join('\n');

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

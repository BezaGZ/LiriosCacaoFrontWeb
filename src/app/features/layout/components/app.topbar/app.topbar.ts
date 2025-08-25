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
import { CartService } from '../../../cart/cart.service';
import { CartItem } from '../../../cart/cart.models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule, CommonModule, MenuModule, ButtonModule,
    DividerModule, MenubarModule, DialogModule,
    SidebarModule, FormsModule
  ],
  templateUrl: './app.topbar.html',
})
export class AppTopbar {
  readonly router = inject(Router);
  readonly cart = inject(CartService);

  entrega: 'domicilio' | 'local' = 'domicilio';
  telefonoWhats = '50230625215';

  irInicio() { this.router.navigate(['/']); }

  get cartItemCount(): number {
    return this.cart.count;
  }

  mostrarCantidadCarrito(): string {
    const cnt = this.cartItemCount;
    return cnt > 99 ? '99+' : String(cnt);
  }

  // WhatsApp checkout
  checkoutWhatsApp() {
    const lines = this.cart.items.map(i =>
      `• ${i.title} x${i.qty} — Q${(i.unitPrice * i.qty).toFixed(2)}`
    ).join('%0A');

    const total = `Total: Q${this.cart.total.toFixed(2)}`;
    const entrega = `Entrega: ${this.entrega === 'domicilio' ? 'A domicilio' : 'Recoger en local'}`;

    const msg = `Hola!%0AQuiero hacer este pedido:%0A%0A${lines}%0A%0A${total}%0A${entrega}`;
    const url = `https://wa.me/${this.telefonoWhats}?text=${msg}`;
    window.open(url, '_blank');
  }

  inc(i: CartItem) { this.cart.inc(i.id); }
  dec(i: CartItem) { this.cart.dec(i.id); }
  remove(i: CartItem) { this.cart.remove(i.id); }

  // propiedad local para el two-way binding
  sidebarVisible = false;

  ngOnInit() {
    // sincroniza el estado del servicio -> UI
    this.cart.sidebarVisible$.subscribe(v => (this.sidebarVisible = !!v));
  }

  showCart() {
    this.cart.open(); // esto disparará el subscribe y pondrá sidebarVisible = true
  }

// Mantén el servicio sincronizado cuando PrimeNG cambie el visible
  onSidebarVisibleChange(v: boolean) {
    // si quieres, puedes exponer setVisible en el service
    if (v) this.cart.open();
    else this.cart.close();
  }
}

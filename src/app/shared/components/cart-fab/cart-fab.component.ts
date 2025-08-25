import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import {CarritoService} from '@shared/carrito.service';

@Component({
  selector: 'app-cart-fab',
  standalone: true,
  imports: [ButtonModule, NgIf],
  template: `
  <div
    class="
      fixed z-50
      right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
      md:right-6 md:bottom-6
      pointer-events-none
    "
  >
    <button
      pButton
      type="button"
      (click)="openCart()"
      class="
        pointer-events-auto
        !rounded-full !w-14 !h-14 md:!w-16 md:!h-16
        !bg-[#452317] !border-none shadow-xl
        hover:scale-105 active:scale-95 transition
        relative
      "
      [icon]="'pi pi-shopping-cart'"
    ></button>

    <span
      *ngIf="count > 0"
      class="
        absolute -top-1 -right-1
        bg-red-500 text-white text-[10px] md:text-xs font-bold
        rounded-full px-[6px] py-[2px] leading-none
        shadow ring-2 ring-white
        animate-bounce
      "
    >
      {{ count > 99 ? '99+' : count }}
    </span>
  </div>
  `,
})
export class CartFabComponent implements OnInit, OnDestroy {
  private cart = inject(CarritoService);
  private router = inject(Router);
  private sub?: Subscription;
  count = 0;

  ngOnInit() {
    this.sub = this.cart.count$.subscribe(n => this.count = n);
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  openCart() {
    // Opciones:
    // 1) Navegar a la página del carrito:
    this.router.navigate(['/carrito']);

    // 2) O abrir un Sidebar de PrimeNG (si prefieres quick view):
    // this.cartSidebarService.open();
  }
}

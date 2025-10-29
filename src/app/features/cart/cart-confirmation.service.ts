import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class CartConfirmationService {
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  /**
   * Muestra un toast de confirmación cuando se agrega un producto al carrito.
   * El usuario puede elegir "Seguir comprando" o "Ir al carrito".
   */
  showAddedToCartConfirmation(productTitle: string): void {
    this.messageService.add({
      key: 'cart-confirm',
      severity: 'success',
      summary: '¡Producto agregado!',
      detail: productTitle,
      sticky: true,
      data: {
        action: 'cart-added'
      }
    });
  }

  /**
   * Navega a la página del carrito.
   */
  goToCart(): void {
    this.router.navigate(['/carrito']);
    this.clearMessages();
  }

  /**
   * Cierra el mensaje de confirmación.
   */
  continueShopping(): void {
    this.clearMessages();
  }

  /**
   * Limpia todos los mensajes de confirmación.
   */
  private clearMessages(): void {
    this.messageService.clear('cart-confirm');
  }
}

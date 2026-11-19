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
    // Un aviso a la vez: agregando varios productos seguidos se apilaban tres
    // o cuatro recuadros, cada uno con su propio contador.
    this.messageService.clear('cart-confirm');

    this.messageService.add({
      key: 'cart-confirm',
      severity: 'success',
      summary: '¡Producto agregado!',
      detail: productTitle,
      // Antes era sticky: se quedaba en pantalla hasta que lo cerraran, y como
      // esta arriba al centro TAPABA las tarjetas del catalogo. Quien queria
      // agregar un segundo producto tenia que cerrar el aviso primero.
      // 6 segundos alcanzan de sobra para tocar "Ir al carrito", y la burbuja
      // del topbar sigue mostrando la cantidad cuando el aviso desaparece.
      life: 6000,
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

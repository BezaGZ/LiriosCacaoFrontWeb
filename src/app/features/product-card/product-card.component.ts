import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProductCardVM } from '@core/ui-models/product-card.vm';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductCardVM;
  @Output() addToCart = new EventEmitter<ProductCardVM>();
  @Output() customize = new EventEmitter<ProductCardVM>();

  // El estado interno ahora solo se preocupa por las imágenes
  currentImageUrls: { base: string; topping?: string; } = { base: '' };

  ngOnInit(): void {
    // Simplemente inicializa las imágenes que vienen con el producto
    this.currentImageUrls = { ...this.product.imageUrls };
  }

  // Maneja errores de carga de imagen
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/img/nophoto.png';
  }

  // Emite el evento para añadir al carrito
  emitAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  // Emite el evento para personalizar
  emitCustomize(): void {
    this.customize.emit(this.product);
  }
}

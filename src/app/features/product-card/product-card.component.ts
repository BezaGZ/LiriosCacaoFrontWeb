import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProductCardVM } from '@core/ui-models/product-card.vm';
import { IMG_PLACEHOLDER } from '@core/utils/image-resolver';

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
export class ProductCardComponent {
  /**
   * Se usa un setter y NO ngOnInit a proposito.
   *
   * Angular reutiliza las tarjetas cuando cambia la lista (por ejemplo al
   * filtrar por categoria). En una tarjeta reutilizada ngOnInit ya no vuelve
   * a correr, asi que copiar las imagenes ahi dejaba la tarjeta mostrando la
   * foto del producto ANTERIOR. Con el setter se actualiza cada vez que llega
   * un producto distinto.
   */
  @Input() set product(valor: ProductCardVM) {
    this._product = valor;
    this.currentImageUrls = { ...valor.imageUrls };
    // Producto nuevo, foto nueva: se reinicia el estado de error.
    this.imagenFallo = false;
    this.capaFallo = false;
  }
  get product(): ProductCardVM { return this._product; }
  private _product!: ProductCardVM;

  /**
   * Flores y eventos no se agregan al carrito: se cotizan por WhatsApp,
   * porque el precio final depende de la conversación.
   */
  get seCotiza(): boolean {
    return this.product.category === 'flor' || this.product.category === 'evento';
  }

  /** El precio es orientativo y el final se acuerda por WhatsApp. */
  get precioEsDesde(): boolean {
    return !!this.product.data?.cotizable?.esDesde;
  }

  /**
   * Un precio en 0 significa que todavia no se ha definido.
   * Mostrar "Q0.00" haria parecer que es gratis.
   */
  get tienePrecio(): boolean {
    return this.product.price > 0;
  }
  @Output() addToCart = new EventEmitter<ProductCardVM>();
  @Output() customize = new EventEmitter<ProductCardVM>();
  @Output() whatsapp = new EventEmitter<ProductCardVM>();

  currentImageUrls: { base: string; topping?: string; } = { base: '' };

  /**
   * El estado de "la foto no cargo" vive AQUI, no en el DOM.
   *
   * Antes el manejador hacia `event.target.src = placeholder`, escribiendo
   * directo en el elemento por fuera de Angular. Cuando Angular reutilizaba
   * ese <img> para otro producto (al filtrar por categoria) se quedaba con el
   * placeholder pegado, y productos que SI tenian foto se veian sin ella.
   * Dejando que Angular controle el [src], eso no puede pasar.
   */
  imagenFallo = false;
  capaFallo = false;

  readonly placeholder = IMG_PLACEHOLDER;

  /** La imagen principal falta: se muestra la tarjeta "Foto proximamente". */
  onImageError(): void {
    this.imagenFallo = true;
  }

  /**
   * La CAPA de topping falta: se oculta y ya.
   * Ojo, aqui no sirve el placeholder: esta imagen se dibuja ENCIMA del
   * producto, asi que poner la tarjeta de "foto proximamente" taparia una
   * foto que si existe.
   */
  onLayerError(): void {
    this.capaFallo = true;
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

  // Emite el evento para abrir WhatsApp (flores)
  emitWhatsApp(event: MouseEvent): void {
    event.stopPropagation();
    this.whatsapp.emit(this.product);
  }
}

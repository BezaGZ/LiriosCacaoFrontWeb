import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Imports de PrimeNG ---
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

// --- Imports de tu Lógica y Datos ---
import { ProductCardVM } from '../../core/models/product-card.vm'; // <-- El modelo genérico
import { CartService } from '../cart/cart.service';
import { CHOCOFRUTA_SEED } from '../../data';
import { calcularPrecioUnitarioChocofruta } from '../../data/chocofruta.logic';
import { buildChocoImagePaths } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnimateOnScrollModule,
    ButtonModule,
    DialogModule,
    CheckboxModule,
    DividerModule,
    DropdownModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  // ----------------------------------------------------
  // --- Propiedades Principales ---
  // ----------------------------------------------------
  @Input() products: ProductCardVM[] = [];
  readonly cart = inject(CartService);

  // ----------------------------------------------------
  // --- Lógica del Dialog de Personalización (para Chocofrutas) ---
  // ----------------------------------------------------
  dialogVisible = false;
  private currentProductData: any = null; // Para guardar datos del producto a personalizar

  // Estado del formulario del dialog
  selectedFrutaSlug?: string;
  selectedChocolateSlug?: string;
  selectedToppingsIds: string[] = [];
  dobleChocolate = false;

  // Opciones para los dropdowns del dialog
  frutasOptions = CHOCOFRUTA_SEED.frutas.map(f => ({ label: f.nombre, value: f.slug }));
  chocolatesOptions = CHOCOFRUTA_SEED.chocolates.map(c => ({ label: c.nombre, value: c.colorSlug }));

  get toppings() { return CHOCOFRUTA_SEED.toppings.filter(t => t.disponible); }

  /**
   * Abre el dialog de personalización SÓLO si el producto es una chocofruta personalizable.
   */
  openCustomize(product: ProductCardVM) {
    console.log('Intentando abrir customizer para:', product);

    if (!product.customizable || product.category !== 'chocofruta') {
      console.log('El producto no es personalizable, saliendo...');
      return; // No hace nada si no es personalizable
    }


    this.currentProductData = product.data; // Guardamos los datos originales
    const { fruta, chocolate, toppings } = product.data;

    // Inicializamos el formulario del dialog con los datos del producto
    this.selectedFrutaSlug = fruta.slug;
    this.selectedChocolateSlug = chocolate.colorSlug;
    this.selectedToppingsIds = toppings.map((t: any) => t.id);
    this.dobleChocolate = false; // Reiniciamos

    this.dialogVisible = true;
  }

  /**
   * Agrega un producto al carrito directamente desde el botón en la tarjeta.
   */
  addToCartFromCard(product: ProductCardVM, event: MouseEvent) {
    event.stopPropagation(); // Evita que se abra el dialog

    this.cart.add({
      kind: 'chocofruta', // Puedes hacer esto dinámico si es necesario
      title: product.title,
      imageUrl: product.imageUrl,
      unitPrice: product.price,
      qty: 1,
      data: product.data,
    });
    this.cart.open();
  }

  /**
   * Agrega el producto personalizado desde el dialog al carrito.
   */
  addToCart() {
    const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) return;

    const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));
    const topNombreList = tops.map(t => t.nombre);
    const title = `Choco${fruta.nombre} con ${choc.nombre}` + (topNombreList.length ? ` + ${topNombreList.join(', ')}` : '');

    const topPrincipal = topNombreList[0];
    const paths = buildChocoImagePaths(fruta.nombre, choc.nombre, topPrincipal);
    const imageUrl = paths.withTop || paths.withoutTop || paths.fallback;

    const unitPrice = this.previewPrice();

    this.cart.add({
      kind: 'chocofruta',
      title,
      imageUrl,
      unitPrice,
      qty: 1,
      data: {
        chocofruta: { fruta, chocolate: choc, toppings: tops, dobleChocolate: this.dobleChocolate, cantidad: 1 },
      },
    });

    this.dialogVisible = false;
    this.cart.open();
  }

  // --- Métodos de ayuda para el dialog (casi sin cambios) ---

  previewPrice(): number {
    const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) return 0;
    const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));
    return calcularPrecioUnitarioChocofruta(
      { fruta, chocolate: choc, toppings: tops, dobleChocolate: this.dobleChocolate, cantidad: 1 },
      CHOCOFRUTA_SEED.reglas
    );
  }


  // Dentro de la clase ProductsComponent en products.component.ts

  /**
   * Maneja el error de carga de una imagen y le asigna una imagen de fallback.
   */
  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/img/nophoto.png';
  }

  previewImage(): string {
    const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) return 'assets/img/nophoto.png';
    const topPrincipal = this.toppings.find(t => t.id === this.selectedToppingsIds[0])?.nombre;
    const paths = buildChocoImagePaths(fruta.nombre, choc.nombre, topPrincipal);
    return paths.withTop || paths.withoutTop || paths.fallback;
  }

  onToggleTopping(id: string, checked: boolean) {
    if (checked) {
      if (!this.selectedToppingsIds.includes(id)) {
        this.selectedToppingsIds = [...this.selectedToppingsIds, id];
      }
    } else {
      this.selectedToppingsIds = this.selectedToppingsIds.filter(x => x !== id);
    }
  }

  protected readonly CHOCOFRUTA_SEED = CHOCOFRUTA_SEED;
}

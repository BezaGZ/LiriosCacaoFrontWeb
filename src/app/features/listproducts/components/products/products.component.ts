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

// --- Imports Clave ---
import { ProductCardComponent } from '@features/product-card/product-card.component';
import { ProductCardVM } from '@core/ui-models/product-card.vm';
import { CartService } from '@features/cart/cart.service';
import { CHOCOFRUTA_SEED } from '@core/domain';
import { calcularPrecioUnitarioChocofruta } from '@core/domain/chocofruta/chocofruta.logic';
import { buildLayeredImagePaths } from '@core/utils/image-resolver';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, FormsModule, AnimateOnScrollModule, ButtonModule, DialogModule,
    CheckboxModule, DividerModule, DropdownModule,
    ProductCardComponent // <-- Añadimos el nuevo componente aquí
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  // --- Propiedades Principales ---
  @Input() products: ProductCardVM[] = [];
  readonly cart = inject(CartService);

  // --- Lógica del Dialog de Personalización (que se abre desde la tarjeta) ---
  dialogVisible = false;
  previewImagePaths = { base: '', topping: '' };
  selectedFrutaSlug?: string;
  selectedChocolateSlug?: string;
  selectedToppingsIds: string[] = [];
  dobleChocolate = false;

  frutasOptions = CHOCOFRUTA_SEED.frutas.map(f => ({ label: f.nombre, value: f.slug }));
  chocolatesOptions = CHOCOFRUTA_SEED.chocolates.map(c => ({ label: c.nombre, value: c.colorSlug }));
  get toppings() { return CHOCOFRUTA_SEED.toppings.filter(t => t.disponible); }

  // --- MANEJADORES DE EVENTOS DE LA TARJETA ---
  handleCustomize(product: ProductCardVM) {
    if (!product.customizable) return;
    const { fruta, chocolate, toppings } = product.data.chocofruta;

    this.selectedFrutaSlug = fruta.slug;
    this.selectedChocolateSlug = chocolate.colorSlug;
    this.selectedToppingsIds = toppings.map((t: any) => t.id);
    this.dobleChocolate = false;

    this.dialogVisible = true;
    this.updatePreviewImages();
  }

  handleAddToCart(product: ProductCardVM) {
    this.cart.add({
      kind: product.category,
      title: product.title,
      unitPrice: product.price,
      qty: 1,
      data: product.data,
      imageUrls: product.imageUrls,
    });
    this.cart.open();
  }

  // --- LÓGICA DEL DIÁLOGO (se mantiene en el padre) ---
  addToCartFromDialog() {
    const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) return;

    const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));
    const title = `Choco${fruta.nombre} con ${choc.nombre}` + (tops.length ? ` + ${tops.map(t => t.nombre).join(', ')}` : '');
    const paths = buildLayeredImagePaths(fruta.nombre, choc.nombre, tops[0]?.nombre);
    const unitPrice = this.previewPrice();

    this.cart.add({
      kind: 'chocofruta',
      title,
      imageUrls: { base: paths.baseImage, topping: paths.toppingImage },
      unitPrice,
      qty: 1,
      data: { chocofruta: { fruta, chocolate: choc, toppings: tops, dobleChocolate: this.dobleChocolate, cantidad: 1 } },
    });

    this.dialogVisible = false;
    this.cart.open();
  }

  updatePreviewImages() {
    const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) {
      this.previewImagePaths = { base: 'assets/img/nophoto.png', topping: '' };
      return;
    }
    const top = this.toppings.find(t => t.id === this.selectedToppingsIds[0]);
    const paths = buildLayeredImagePaths(fruta.nombre, choc.nombre, top?.nombre);
    this.previewImagePaths.base = paths.baseImage;
    this.previewImagePaths.topping = paths.toppingImage;
  }

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

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/img/nophoto.png';
  }

  onToggleTopping(id: string, checked: boolean) {
    if (checked) {
      if (!this.selectedToppingsIds.includes(id)) {
        this.selectedToppingsIds = [...this.selectedToppingsIds, id];
      }
    } else {
      this.selectedToppingsIds = this.selectedToppingsIds.filter(x => x !== id);
    }
    this.updatePreviewImages();
  }

  protected readonly CHOCOFRUTA_SEED = CHOCOFRUTA_SEED;
}

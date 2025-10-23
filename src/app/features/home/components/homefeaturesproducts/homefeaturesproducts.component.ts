import { Component, inject } from '@angular/core';
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
import { MessageService } from 'primeng/api';

// Imports para los datos de esta sección específica
import { FEATURED_PRESETS } from './components/featured.presets';
import { presetToCard } from './components/featured.adapter';

@Component({
  selector: 'app-homefeaturesproducts',
  standalone: true,
  imports: [
    CommonModule, FormsModule, AnimateOnScrollModule, ButtonModule, DialogModule,
    CheckboxModule, DividerModule, DropdownModule,
    ProductCardComponent // <-- Añadimos el nuevo componente aquí
  ],
  templateUrl: './homefeaturesproducts.component.html',
  styleUrls: ['./homefeaturesproducts.component.scss']
})
export class HomefeaturesproductsComponent {
  private readonly messageService = inject(MessageService);

  // La lista de productos ahora usa el tipo universal ProductCardVM
  products: ProductCardVM[] = FEATURED_PRESETS.map(presetToCard);
  readonly cart = inject(CartService);

  // --- Lógica del diálogo de personalización ---
  dialogVisible = false;
  previewImagePaths = { base: '', topping: '' };
  selectedFrutaSlug?: string;
  selectedChocolateSlug?: string;
  selectedToppingsIds: string[] = [];
  dobleChocolate = false;

  frutasOptions = CHOCOFRUTA_SEED.frutas.map(f => ({ label: f.nombre, value: f.slug }));
  chocolatesOptions = CHOCOFRUTA_SEED.chocolates.map(c => ({ label: c.nombre, value: c.colorSlug }));
  get toppings() { return CHOCOFRUTA_SEED.toppings.filter(t => t.disponible); }


  // --- NUEVOS MÉTODOS PARA MANEJAR EVENTOS DE LA TARJETA ---

  /**
   * Se ejecuta cuando el usuario hace clic en una tarjeta para personalizarla.
   * Recibe el producto desde el ProductCardComponent.
   */
  handleCustomize(product: ProductCardVM): void {
    if (!product.customizable) return;
    const { fruta, chocolate, toppings } = product.data.chocofruta;

    this.selectedFrutaSlug = fruta.slug;
    this.selectedChocolateSlug = chocolate.colorSlug;
    this.selectedToppingsIds = toppings.map((t: any) => t.id);
    this.dobleChocolate = false; // Siempre se reinicia al abrir

    this.dialogVisible = true;
    this.updatePreviewImages();
  }

  /**
   * Se ejecuta cuando el usuario hace clic en el ícono de carrito de una tarjeta.
   * Recibe el producto (con el topping seleccionado) desde el ProductCardComponent.
   */
  handleAddToCart(product: ProductCardVM): void {
    const { fruta, chocolate, toppings } = product.data.chocofruta;
    const topPrincipal = toppings[0];
    const paths = buildLayeredImagePaths(fruta.nombre, chocolate.nombre, topPrincipal?.nombre);

    this.cart.add({
      kind: product.category,
      title: product.title,
      unitPrice: product.price,
      qty: 1,
      data: product.data,
      imageUrls: {
        base: paths.baseImage,
        topping: paths.toppingImage
      }
    });

    this.messageService.add({
      severity: 'success',
      summary: '¡Añadido!',
      detail: `${product.title} se agregó a tu carrito.`,
      life: 3000
    });

    this.cart.open();
  }


  // --- MÉTODOS EXCLUSIVOS DEL DIÁLOGO ---

  /**
   * Se ejecuta desde el botón "Agregar al carrito" DENTRO del diálogo.
   */
  addToCartFromDialog(): void {
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

    this.messageService.add({
      severity: 'success',
      summary: '¡Añadido!',
      detail: `${title} se agregó a tu carrito.`,
      life: 3000
    });

    this.cart.open();
  }

  updatePreviewImages(): void {
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

  onToggleTopping(id: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedToppingsIds.includes(id)) {
        this.selectedToppingsIds = [...this.selectedToppingsIds, id];
      }
    } else {
      this.selectedToppingsIds = this.selectedToppingsIds.filter(x => x !== id);
    }
    this.updatePreviewImages();
  }

  // Nuevos métodos para el diseño tipo Uber Eats
  selectFruta(slug: string): void {
    this.selectedFrutaSlug = slug;
    this.updatePreviewImages();
  }

  selectChocolate(slug: string | null): void {
    this.selectedChocolateSlug = slug ?? undefined;
    this.updatePreviewImages();
  }

  toggleTopping(id: string): void {
    if (this.selectedToppingsIds.includes(id)) {
      this.selectedToppingsIds = this.selectedToppingsIds.filter(x => x !== id);
    } else {
      this.selectedToppingsIds = [...this.selectedToppingsIds, id];
    }
    this.updatePreviewImages();
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/img/nophoto.png';
  }

  protected readonly CHOCOFRUTA_SEED = CHOCOFRUTA_SEED;
}

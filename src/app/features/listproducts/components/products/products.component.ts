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
import { CHOCOFRUTA_SEED, HELADO_SEED } from '@core/domain';
import { calcularPrecioUnitarioChocofruta } from '@core/domain/chocofruta/chocofruta.logic';
import { calcularPrecioUnitarioHelado } from '@core/domain/helado/helado.logic';
import { buildLayeredImagePaths, imgHeladoPaleta, IMG_PLACEHOLDER } from '@core/utils/image-resolver';
import { CotizacionDialogComponent } from '../cotizacion-dialog/cotizacion-dialog.component';
import { ItemCotizable } from '@core/ui-models/cotizable';
import { CartConfirmationService } from '@features/cart/cart-confirmation.service';
import { tituloChocofruta, tituloHelado } from '@core/utils/product-title';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, FormsModule, AnimateOnScrollModule, ButtonModule, DialogModule,
    CheckboxModule, DividerModule, DropdownModule,
    ProductCardComponent, CotizacionDialogComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  /**
   * El HTML prerenderizado se genera para /productos SIN filtro, o sea con los
   * 28 productos. Al abrir /productos?category=evento el cliente re-renderiza
   * con 7, y en ese baile Angular reutiliza tarjetas: los errores de carga de
   * las fotos que faltan llegaban tarde y marcaban como "sin foto" a productos
   * que si tenian. Con ngSkipHydration esta lista se dibuja de cero.
   *
   * No afecta al SEO: el HTML prerenderizado sigue trayendo todos los
   * productos para el crawler.
   */
  host: { 'ngSkipHydration': 'true' },
})
export class ProductsComponent {
  private readonly cartConfirmation = inject(CartConfirmationService);

  // --- Propiedades Principales ---
  @Input() products: ProductCardVM[] = [];
  readonly cart = inject(CartService);
  protected readonly CHOCOFRUTA_SEED = CHOCOFRUTA_SEED;
  // --- Lógica del Diálogo de Personalización ---
  dialogVisible = false;
  editingProduct: ProductCardVM | null = null; // Guarda el producto que estamos personalizando
  previewImagePaths = { base: '', topping: '' };

  // --- Estado del Formulario del Diálogo ---
  // Para Chocofrutas
  selectedFrutaSlug?: string;
  dobleChocolate = false;
  // Para Helados
  selectedSaborId?: string;
  // Compartido
  selectedChocolateSlug?: string | null = null;
  selectedToppingsIds: string[] = [];
  // Para líneas de chocolate (sub-opción)
  selectedLineasChocolateSlug?: string | null = null;

  // --- Opciones para Dropdowns ---
  frutasOptions = CHOCOFRUTA_SEED.frutas.map(f => ({ label: f.nombre, value: f.slug }));
  saboresHeladoOptions = HELADO_SEED.sabores.map(s => ({ label: s.nombre, value: s.id }));
  chocolatesOptions = CHOCOFRUTA_SEED.chocolates.map(c => ({ label: c.nombre, value: c.colorSlug }));
  get toppings() { return CHOCOFRUTA_SEED.toppings.filter(t => t.disponible); }

  // Verifica si "Líneas de chocolate" está seleccionado
  get hasLineasChocolateSelected(): boolean {
    return this.selectedToppingsIds.includes('top_lineaschocolate');
  }

  // 1. Añade una propiedad para el estado del checkbox
  extraChocolateHelado = false;

  // 2. Haz HELADO_SEED accesible para el HTML
  protected readonly HELADO_SEED = HELADO_SEED;

  // --- Estado del diálogo de cotización (flores y eventos) ---
  cotizacionDialogVisible = false;
  selectedCotizable: ItemCotizable | null = null;

  /** Categorías que se cotizan por WhatsApp en vez de agregarse al carrito. */
  private readonly SE_COTIZAN = ['flor', 'evento'];

  private esCotizable(product: ProductCardVM): boolean {
    return this.SE_COTIZAN.includes(product.category);
  }

  private abrirCotizacion(product: ProductCardVM): void {
    this.selectedCotizable = product.data?.cotizable ?? null;
    this.cotizacionDialogVisible = true;
  }

  // --- MANEJADORES DE EVENTOS ---

  /**
   * Sin trackBy, Angular reutiliza los nodos del *ngFor al cambiar de
   * categoria y mezcla el estado de una tarjeta con el producto de otra.
   */
  trackPorId(_indice: number, product: ProductCardVM): string {
    return product.id;
  }

  handleCustomize(product: ProductCardVM): void {
    // Flores y eventos no se personalizan en línea: se cotizan.
    if (this.esCotizable(product)) {
      this.abrirCotizacion(product);
      return;
    }

    if (!product.customizable) return;

    this.editingProduct = product; // Guardamos el producto actual

    // Limpiamos el estado anterior
    this.selectedToppingsIds = [];
    this.selectedChocolateSlug = null;
    this.selectedLineasChocolateSlug = null;
    this.dobleChocolate = false;
    this.extraChocolateHelado = false;

    if (product.category === 'chocofruta') {
      const { fruta, chocolate, toppings } = product.data.chocofruta;
      this.selectedFrutaSlug = fruta.slug;
      this.selectedChocolateSlug = chocolate.colorSlug;
      this.selectedToppingsIds = toppings.map((t: any) => t.id);
    }

    if (product.category === 'helado') {
      const { sabor, chocolate, toppings } = product.data.helado;
      this.selectedSaborId = sabor.id;
      this.selectedChocolateSlug = chocolate?.colorSlug;
      this.selectedToppingsIds = toppings.map((t: any) => t.id);
    }

    this.dialogVisible = true;
    this.updatePreviewImages();
  }

  handleAddToCart(product: ProductCardVM): void {
    // Esta función ya es genérica y funciona bien
    this.cart.add({
      kind: product.category,
      title: product.title,
      unitPrice: product.price,
      qty: 1,
      data: product.data,
      imageUrls: product.imageUrls,
    });

    this.cartConfirmation.showAddedToCartConfirmation(product.title);
  }


  // --- LÓGICA DEL DIÁLOGO ---

  // products.component.ts

  addToCartFromDialog() {
    const category = this.editingProduct?.category;
    let title: string = ''; // 1. Declaramos 'title' aquí para que sea accesible en toda la función

    if (category === 'chocofruta') {
      const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
      const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
      if (!fruta || !choc) return;

      const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));

      title = tituloChocofruta({
        fruta, chocolate: choc, toppings: tops,
        dobleChocolate: this.dobleChocolate,
        lineasChocolateSlug: this.selectedLineasChocolateSlug,
      });

      const paths = buildLayeredImagePaths(fruta.nombre, choc.nombre, tops[0]?.nombre);
      const unitPrice = this.previewPrice();

      this.cart.add({
        kind: 'chocofruta', title, unitPrice, qty: 1,
        imageUrls: { base: paths.baseImage, topping: paths.toppingImage },
        data: { chocofruta: { fruta, chocolate: choc, toppings: tops, dobleChocolate: this.dobleChocolate, lineasChocolateSlug: this.selectedLineasChocolateSlug, cantidad: 1 } },
      });
    }

    if (category === 'helado') {
      const sabor = HELADO_SEED.sabores.find(s => s.id === this.selectedSaborId);
      const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
      if (!sabor) return;

      const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));

      const unitPrice = this.previewPrice();
      title = tituloHelado({
        sabor, chocolate: choc, toppings: tops,
        chocolateExtra: this.extraChocolateHelado,
        lineasChocolateSlug: this.selectedLineasChocolateSlug,
      });

      const imageUrls = { base: imgHeladoPaleta(sabor.slug), topping: '' };

      this.cart.add({
        kind: 'helado', title, unitPrice, qty: 1, imageUrls,
        data: { helado: { sabor, chocolate: choc, toppings: tops, chocolateExtra: this.extraChocolateHelado, lineasChocolateSlug: this.selectedLineasChocolateSlug, cantidad: 1 } },
      });
    }

    // Si no se pudo generar un título, no hacemos nada más.
    if (!title) return;

    this.dialogVisible = false;
    this.cartConfirmation.showAddedToCartConfirmation(title);
  }

  updatePreviewImages(): void {
    const category = this.editingProduct?.category;
    if (category === 'chocofruta') {
      const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
      const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
      if (!fruta || !choc) return;
      const top = this.toppings.find(t => t.id === this.selectedToppingsIds[0]);
      const paths = buildLayeredImagePaths(fruta.nombre, choc.nombre, top?.nombre);
      this.previewImagePaths = { base: paths.baseImage, topping: paths.toppingImage };
    }
    if (category === 'helado') {
      const sabor = HELADO_SEED.sabores.find(s => s.id === this.selectedSaborId);
      if (!sabor) return;
      // Por ahora, el helado solo tiene imagen base. Se podría extender para toppings.
      this.previewImagePaths = { base: imgHeladoPaleta(sabor.slug), topping: '' };
    }
  }

  previewPrice(): number {
    const category = this.editingProduct?.category;
    if (category === 'chocofruta') {
      const fruta = CHOCOFRUTA_SEED.frutas.find(f => f.slug === this.selectedFrutaSlug);
      const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
      if (!fruta || !choc) return 0;
      const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));
      return calcularPrecioUnitarioChocofruta({ fruta, chocolate: choc, toppings: tops, dobleChocolate: this.dobleChocolate, cantidad: 1 }, CHOCOFRUTA_SEED.reglas);
    }
    if (category === 'helado') {
      const sabor = HELADO_SEED.sabores.find(s => s.id === this.selectedSaborId);
      const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
      const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));
      if (!sabor) return 0;
      return calcularPrecioUnitarioHelado({ sabor, chocolate: choc, toppings: tops, chocolateExtra: this.extraChocolateHelado, cantidad: 1 }, HELADO_SEED.reglas);
    }
    return 0;
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

  selectSabor(id: string): void {
    this.selectedSaborId = id;
    this.updatePreviewImages();
  }

  selectChocolate(slug: string | null): void {
    this.selectedChocolateSlug = slug;
    this.updatePreviewImages();
  }

  toggleTopping(id: string): void {
    if (this.selectedToppingsIds.includes(id)) {
      this.selectedToppingsIds = this.selectedToppingsIds.filter(x => x !== id);
      // Si se deselecciona "Líneas de chocolate", limpiar la sub-opción
      if (id === 'top_lineaschocolate') {
        this.selectedLineasChocolateSlug = null;
      }
    } else {
      this.selectedToppingsIds = [...this.selectedToppingsIds, id];
    }
    this.updatePreviewImages();
  }

  selectLineasChocolate(slug: string): void {
    this.selectedLineasChocolateSlug = slug;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = IMG_PLACEHOLDER;
  }

  /** La capa de topping se oculta si falta, para no tapar el producto. */
  onLayerError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  /** Clic en el botón de WhatsApp de una tarjeta que se cotiza. */
  handleWhatsApp(product: ProductCardVM): void {
    if (this.esCotizable(product)) {
      this.abrirCotizacion(product);
    }
  }
}

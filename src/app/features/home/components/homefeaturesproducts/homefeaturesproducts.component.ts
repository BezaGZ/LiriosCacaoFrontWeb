import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { FEATURED_PRESETS } from '../../../../core/utils/featured.presets';
import { presetToCard, FeaturedCardVM } from '../../../../core/utils/featured.adapter';
import { FeaturedPreset } from '../../../../core/utils/featured.models';
import { DialogModule } from 'primeng/dialog';

// para personalizar
import { CHOCOFRUTA_SEED } from '../../../..//data';
import { calcularPrecioUnitarioChocofruta } from '../../../../data/chocofruta.logic';
import { buildChocoImagePaths } from '../../../../core/utils/image-resolver';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-homefeaturesproducts',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollModule, ButtonModule, DialogModule, FormsModule],
  templateUrl: './homefeaturesproducts.component.html',
  styleUrls: ['./homefeaturesproducts.component.scss']
})
export class HomefeaturesproductsComponent {
  // view-models para las cards
  products: FeaturedCardVM[] = FEATURED_PRESETS.map(presetToCard);

  // guardamos el preset elegido para editar
  dialogVisible = false;
  editPreset?: FeaturedPreset;

  // Guarda las rutas calculadas del último preview (para el fallback)
  private lastImgPaths?: { withTop: string; withoutTop: string; fallback: string };


  // estado editable (simple)
  selectedFrutaSlug?: string;
  selectedChocolateSlug?: string;
  selectedToppingsIds: string[] = [];
  dobleChocolate = false;

  openCustomize(presetId: string) {
    const preset = FEATURED_PRESETS.find(p => p.id === presetId)!;
    this.editPreset = structuredClone(preset);

    // inicializamos los selects con lo del preset
    this.selectedFrutaSlug = preset.fruta.slug;
    this.selectedChocolateSlug = preset.chocolate.colorSlug;
    this.selectedToppingsIds = preset.toppings.map(t => t.id);
    this.dobleChocolate = !!preset.dobleChocolate;

    this.dialogVisible = true;
  }

  get frutas() { return CHOCOFRUTA_SEED.frutas.filter(f => f.disponible); }
  get chocolates() { return CHOCOFRUTA_SEED.chocolates.filter(c => c.disponible); }
  get toppings() { return CHOCOFRUTA_SEED.toppings.filter(t => t.disponible); }

  previewImage(): string {
    const fruta = this.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc  = this.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) return 'assets/img/nophoto.jpg';

    // 1er topping seleccionado = topping "principal" para la foto
    const topPrincipal = this.toppings.find(t => t.id === this.selectedToppingsIds[0])?.nombre;

    // construimos las rutas posibles
    this.lastImgPaths = buildChocoImagePaths(fruta.nombre, choc.nombre, topPrincipal);

    // prioridad: con topping → sin topping → (error) nophoto
    return this.lastImgPaths.withTop || this.lastImgPaths.withoutTop || this.lastImgPaths.fallback;
  }

  previewPrice(): number {
    const fruta = this.frutas.find(f => f.slug === this.selectedFrutaSlug);
    const choc  = this.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug);
    if (!fruta || !choc) return 0;

    const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));
    return calcularPrecioUnitarioChocofruta(
      { fruta, chocolate: choc, toppings: tops, dobleChocolate: this.dobleChocolate, cantidad: 1 },
      CHOCOFRUTA_SEED.reglas
    );
  }

  // Fallback en cascada: con topping -> sin topping -> nophoto
  onPreviewImgError(ev: Event) {
    if (!this.lastImgPaths) return;
    const img = ev.target as HTMLImageElement;

    if (img.src.endsWith(this.lastImgPaths.withTop) && this.lastImgPaths.withoutTop) {
      img.src = this.lastImgPaths.withoutTop; // bajar a sin topping
    } else {
      img.src = this.lastImgPaths.fallback;   // último recurso
    }
  }



  // 2 acciones posibles:
  // A) Agregar al carrito (no modifica la card)
  addToCart() {
    // ... usa tu CarritoService aquí
    this.dialogVisible = false;
  }

  // B) Actualizar la card con la nueva combinación
  applyToCard() {
    if (!this.editPreset) return;
    const fruta = this.frutas.find(f => f.slug === this.selectedFrutaSlug)!;
    const choc = this.chocolates.find(c => c.colorSlug === this.selectedChocolateSlug)!;
    const tops = this.toppings.filter(t => this.selectedToppingsIds.includes(t.id));

    // muta el preset en memoria
    this.editPreset.fruta = fruta;
    this.editPreset.chocolate = choc;
    this.editPreset.toppings = tops;
    this.editPreset.dobleChocolate = this.dobleChocolate;

    // refleja en la UI generando de nuevo el VM
    const idx = this.products.findIndex(p => p.id === this.editPreset!.id);
    this.products[idx] = presetToCard(this.editPreset!);
    this.products = [...this.products]; // trigger cambio
    this.dialogVisible = false;
  }

  protected readonly CHOCOFRUTA_SEED = CHOCOFRUTA_SEED;

  onToggleTopping(id: string, checked: boolean) {
    if (checked) {
      if (!this.selectedToppingsIds.includes(id)) {
        this.selectedToppingsIds = [...this.selectedToppingsIds, id];
      }
    } else {
      this.selectedToppingsIds = this.selectedToppingsIds.filter(x => x !== id);
    }
  }


  // homefeaturesproducts.component.ts (añade este método)
  onCardImgError(product: FeaturedCardVM, ev: Event) {
    const img = ev.target as HTMLImageElement;
    const { withTop, withoutTop, fallback } = product.imgPaths;

    // Si falló la variante con topping → pruebo sin topping
    if (withTop && img.src.endsWith(withTop) && withoutTop) {
      img.src = withoutTop;
      return;
    }
    // Si falló sin topping → pongo nophoto
    if (withoutTop && img.src.endsWith(withoutTop)) {
      img.src = fallback;
      return;
    }
    // Cualquier otro caso → nophoto
    img.src = fallback;
  }
}

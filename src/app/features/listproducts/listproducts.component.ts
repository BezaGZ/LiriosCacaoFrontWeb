import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Tus Componentes Hijos ---
import { ProductsComponent } from '@features/listproducts/components/products/products.component';
import { CategoryFiltersComponent } from '../listproducts/components/category-filters/category-filters.component';
import { SearchBarComponent } from '../listproducts/components/search-bar/search-bar.component';

// --- ¡Importante! Usamos los nuevos datos ---
import { ALL_PRODUCTS } from '../../core/products/all-products';
import { ProductCardVM } from '@core/ui-models/product-card.vm';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-listproducts',
  standalone: true,
  imports: [
    CommonModule,
    ProductsComponent,
    CategoryFiltersComponent,
    SearchBarComponent,
  ],
  templateUrl: './listproducts.component.html',
})
export class ListproductsComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  // Tipado actualizado a ProductCardVM
  allProducts: ProductCardVM[] = [];
  filteredProducts: ProductCardVM[] = [];

  currentCategory = 'all';
  private currentSearch = '';

  ngOnInit() {
    this.allProducts = ALL_PRODUCTS;

    // Nos "suscribimos" a los cambios en los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      // Leemos el parámetro 'category' de la URL
      const categoryFromUrl = params['category'];

      // Si existe, lo usamos. Si no, usamos 'all' por defecto.
      this.currentCategory = categoryFromUrl || 'all';

      // ¡Aplicamos los filtros con la categoría que acabamos de leer!
      this.applyFilters();
    });
  }

  onSearch(searchTerm: string) {
    this.currentSearch = searchTerm.toLowerCase();
    this.applyFilters();
  }

  onCategorySelect(categoryId: string) {
    // Cuando el usuario hace clic en un filtro DENTRO de la página,
    // también actualizamos el estado.
    this.currentCategory = categoryId;
    this.applyFilters();
  }

  private applyFilters() {
    let tempProducts = [...this.allProducts];

    // 1. Filtrar por CATEGORÍA (funciona perfecto con ProductCardVM)
    if (this.currentCategory !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === this.currentCategory);
    }

    // 2. Filtrar por TÉRMINO DE BÚSQUEDA (funciona perfecto con ProductCardVM)
    if (this.currentSearch) {
      tempProducts = tempProducts.filter(p =>
        p.title.toLowerCase().includes(this.currentSearch)
      );
    }

    this.filteredProducts = tempProducts;
  }
}

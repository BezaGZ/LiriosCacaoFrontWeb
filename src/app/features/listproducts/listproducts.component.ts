import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ProductsComponent } from '@features/listproducts/components/products/products.component';
import { CategoryFiltersComponent } from '../listproducts/components/category-filters/category-filters.component';
import { SearchBarComponent } from '../listproducts/components/search-bar/search-bar.component';
import { ALL_PRODUCTS } from '../../core/products/all-products';
import { ProductCardVM } from '@core/ui-models/product-card.vm';
import { ActivatedRoute, Router } from '@angular/router';

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
  readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  allProducts: ProductCardVM[] = [];
  filteredProducts: ProductCardVM[] = [];

  currentCategory = 'all';
  private currentSearch = '';

  ngOnInit() {
    this.allProducts = ALL_PRODUCTS;

    this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'] || 'all';
      this.currentSearch = params['search'] || '';

      this.updateSeoTags(this.currentCategory);
      this.applyFilters();
    });
  }

  private updateSeoTags(category: string) {
    let title = 'Catálogo Completo | Lirio & Cacao';
    let description = 'Explora nuestro catálogo completo de chocofrutas, helados artesanales, arreglos florales y más. Hecho con amor en Chiquimula.';

    switch (category) {
      case 'chocofruta':
        title = 'Chocofrutas a Domicilio en Chiquimula | Lirio & Cacao';
        description = 'Deliciosas fresas, piñas y bananos cubiertos de chocolate premium. Elige tus toppings favoritos y pide en línea.';
        break;
      case 'helado':
        title = 'Paletas de Helado Artesanal en Chiquimula | Lirio & Cacao';
        description = 'Refréscate con nuestras paletas de helado hechas con ingredientes naturales. Sabores de vino, oreo, café y más.';
        break;
      case 'flor':
        title = 'Arreglos Florales para Toda Ocasión | Lirio & Cacao';
        description = 'Sorprende con nuestros hermosos arreglos florales. Ramos de rosas, detalles para cumpleaños y eventos especiales en Chiquimula.';
        break;
      case 'evento':
        title = 'Detalles y Arreglos para Eventos | Lirio & Cacao';
        description = 'Cotiza con nosotros los detalles para tu evento especial. Ofrecemos arreglos, chocofrutas y más para hacer tu celebración inolvidable.';
        break;
    }

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }

  onSearch(searchTerm: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: searchTerm || null },
      queryParamsHandling: 'merge',
    });
  }

  onCategorySelect(categoryId: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge',
    });
  }

  private applyFilters() {
    let tempProducts = [...this.allProducts];
    if (this.currentCategory !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === this.currentCategory);
    }
    if (this.currentSearch) {
      tempProducts = tempProducts.filter(p =>
        p.title.toLowerCase().includes(this.currentSearch)
      );
    }
    this.filteredProducts = tempProducts;
  }
}

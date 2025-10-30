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
    let description = 'Explora nuestro catálogo completo de chocofrutas, chocofresas, chocobananos, helados artesanales, ramos de rosas y más. Hecho con amor en Chiquimula.';

    switch (category) {
      case 'chocofruta':
        title = 'Chocofrutas a Domicilio en Chiquimula: Chocofresas, Chocobananos | Lirio & Cacao';
        description = 'Chocofrutas artesanales en Chiquimula: chocofresas, chocobananos, choco uvas, choco piña, choco sandía. Cubiertas de chocolate premium con toppings personalizables. ¡Entrega a domicilio!';
        break;
      case 'helado':
        title = 'Paletas de Helado Artesanal en Chiquimula | Lirio & Cacao';
        description = 'Helados artesanales en Chiquimula. Paletas de helado hechas con ingredientes naturales. Sabores de vino, oreo, café y más. ¡Refréscate con calidad!';
        break;
      case 'flor':
        title = 'Florería en Chiquimula: Ramos de Rosas, Girasoles y Fresas con Chocolate | Lirio & Cacao';
        description = 'Florería en Chiquimula. Ramos de rosas, ramos de girasoles, arreglos florales y fresas cubiertas de chocolate. Detalles perfectos para cumpleaños, bodas y 15 años. ¡Sorprende con amor!';
        break;
      case 'evento':
        title = 'Detalles para Eventos en Chiquimula: Cumpleaños, Bodas, 15 Años | Lirio & Cacao';
        description = 'Detalles para eventos en Chiquimula. Especialistas en cumpleaños, bodas, 15 años y fiestas. Chocofrutas, arreglos florales y más para hacer tu celebración inolvidable. ¡Cotiza con nosotros!';
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

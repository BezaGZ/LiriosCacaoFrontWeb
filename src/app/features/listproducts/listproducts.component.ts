import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ProductsComponent } from '@features/listproducts/components/products/products.component';
import { CategoryFiltersComponent } from '../listproducts/components/category-filters/category-filters.component';
import { SearchBarComponent } from '../listproducts/components/search-bar/search-bar.component';
import { ALL_PRODUCTS } from '../../core/products/all-products';
import { ProductCardVM } from '@core/ui-models/product-card.vm';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { matchesSearch } from '@core/utils/text';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-listproducts',
  standalone: true,
  imports: [
    CommonModule,
    ProductsComponent,
    CategoryFiltersComponent,
    SearchBarComponent,
    RouterLink,
  ],
  templateUrl: './listproducts.component.html',
  styleUrl: './listproducts.component.scss',
})
export class ListproductsComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly seo = inject(SeoService);

  allProducts: ProductCardVM[] = [];
  filteredProducts: ProductCardVM[] = [];

  currentCategory = 'all';
  private currentSearch = '';

  ngOnInit() {
    this.allProducts = ALL_PRODUCTS;

    this.route.queryParams.subscribe(params => {
      // Los eventos se mudaron a /eventos. Este enlace estuvo en el sitemap y
      // en Google, asi que en vez de mostrar un catalogo vacio se redirige.
      if (params['category'] === 'evento') {
        this.router.navigate(['/eventos'], { replaceUrl: true });
        return;
      }

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
    if (this.currentSearch.trim()) {
      // Se normalizan ambos lados: sin esto, "Fresa" o "Piña" no encontraban nada.
      tempProducts = tempProducts.filter(p => matchesSearch(p.title, this.currentSearch));
    }
    this.filteredProducts = tempProducts;

    // Catalogo como datos estructurados, para que Google entienda que esta
    // pagina es una lista de productos con precios y no solo texto.
    this.seo.limpiarJsonLdDePagina();
    this.seo.insertItemListSchema(
      this.currentCategory === 'all' ? 'Catálogo Lirio y Cacao' : `Categoría: ${this.currentCategory}`,
      this.filteredProducts
    );
  }
}

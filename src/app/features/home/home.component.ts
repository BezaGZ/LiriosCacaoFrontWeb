import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {HomewelcomeComponent} from '@features/home/components/homewelcome/homewelcome.component';
import {HomeCategoriesComponent} from '@features/home/components/homecategories/homecategories.component';
import {
  HomefeaturesproductsComponent
} from '@features/home/components/homefeaturesproducts/homefeaturesproducts.component';
import {HomecontactComponent} from '@features/home/components/homecontact/homecontact.component';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-home',
  imports: [
    HomewelcomeComponent,
    HomeCategoriesComponent,
    HomefeaturesproductsComponent,
    HomecontactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly seoService = inject(SeoService);

  ngOnInit() {
    // --- TÍTULO Y DESCRIPCIÓN OPTIMIZADOS ---
    this.titleService.setTitle('Arreglos Florales, Chocofrutas y Helados en Chiquimula | Lirio & Cacao');

    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre en Lirio & Cacao los mejores arreglos florales, deliciosas chocofrutas y helados artesanales en Chiquimula. El detalle perfecto para eventos y regalos. ¡Haz tu pedido!'
    });

    // --- JSON-LD STRUCTURED DATA ---
    this.seoService.insertLocalBusinessSchema();
    this.seoService.insertOrganizationSchema();
  }

  ngOnDestroy() {
    // Limpieza al salir del componente
    this.seoService.clearJsonLdScripts();
  }
}


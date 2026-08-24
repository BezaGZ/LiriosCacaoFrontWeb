import {Component, inject, OnInit} from '@angular/core';
import {HomewelcomeComponent} from '@features/home/components/homewelcome/homewelcome.component';
import {HomeCategoriesComponent} from '@features/home/components/homecategories/homecategories.component';
import {
  HomefeaturesproductsComponent
} from '@features/home/components/homefeaturesproducts/homefeaturesproducts.component';
import {HomecontactComponent} from '@features/home/components/homecontact/homecontact.component';
import {HomeserviciosComponent} from '@features/home/components/homeservicios/homeservicios.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [
    HomewelcomeComponent,
    HomeserviciosComponent,
    HomeCategoriesComponent,
    HomefeaturesproductsComponent,
    HomecontactComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  ngOnInit() {
    // --- TÍTULO Y DESCRIPCIÓN OPTIMIZADOS ---
    this.titleService.setTitle('Chocofresas, Chocobananos, Helados y Florería Chiquimula | Lirio & Cacao');

    this.metaService.updateTag({
      name: 'description',
      content: 'Chocofrutas artesanales en Chiquimula: chocofresas, chocobananos, choco uvas. Florería con ramos de rosas, girasoles y fresas cubiertas de chocolate. Helados artesanales. Detalles para cumpleaños, bodas y 15 años. ¡Entrega a domicilio!'
    });
  }
}


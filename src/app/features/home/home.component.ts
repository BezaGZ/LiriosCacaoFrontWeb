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
    // El titulo tambien nombraba solo la mitad del negocio: faltaban los
    // eventos, que son el producto de mayor ticket.
    this.titleService.setTitle('Chocofrutas, Flores y Eventos en Chiquimula | Lirios y Cacao');

    this.metaService.updateTag({
      name: 'description',
      content: 'Chocofrutas artesanales, helados, arreglos florales y organización completa de eventos en Chiquimula. Chocofresas y chocobananos, ramos de rosas y girasoles, bouquets de fresas con chocolate, y jardín propio para hasta 150 personas. Entrega a domicilio.'
    });
  }
}


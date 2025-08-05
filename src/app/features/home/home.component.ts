import { Component } from '@angular/core';
import {HomewelcomeComponent} from '@features/home/components/homewelcome/homewelcome.component';
import {HomeCategoriesComponent} from '@features/home/components/homecategories/homecategories.component';
import {
  HomefeaturesproductsComponent
} from '@features/home/components/homefeaturesproducts/homefeaturesproducts.component';
import {HomecontactComponent} from '@features/home/components/homecontact/homecontact.component';

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
export class HomeComponent {

}

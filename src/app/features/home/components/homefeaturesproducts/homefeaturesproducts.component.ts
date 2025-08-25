import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-homefeaturesproducts',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollModule, ButtonModule],
  templateUrl: './homefeaturesproducts.component.html',
  styleUrls: ['./homefeaturesproducts.component.scss']
})
export class HomefeaturesproductsComponent {
  products = [
    {
      imageUrl: '/assets/img/chocos/pina/Chocopinachiclemalvaviscos.png',
      name: 'Chocobanano tradicional con manía',
      price: 7,
    },
    {
      imageUrl: '/assets/img/chocos/pina/Chocopinachiclemalvaviscos.png',
      name: 'Chocobanano con chocolate de chicle y Oreo',
      price: 8,
    },
    {
      imageUrl: '/assets/img/chocos/pina/Chocopinachiclemalvaviscos.png',
      name: 'Chocobanano de caramelo con manía',
      price: 8,
    },
    {
      imageUrl: '/assets/img/chocos/pina/Chocopinachiclemalvaviscos.png',
      name: 'Chocopiña con chocolate blanco y coco',
      price: 8,
    },
    {
      imageUrl: '/assets/img/chocos/pina/Chocopinachiclemalvaviscos.png',
      name: 'Chocopiña con chocolate blanco y anisillo',
      price: 8,
    },
    {
      imageUrl: '/assets/img/chocos/pina/Chocopinachiclemalvaviscos.png',
      name: 'Chocofresa con chocolate de guinda y anisillo',
      price: 8,
    },
  ];
}

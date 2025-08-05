import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnimateOnScrollModule} from 'primeng/animateonscroll';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-homefeaturesproducts',
  imports: [CommonModule, AnimateOnScrollModule, ButtonModule],
  templateUrl: './homefeaturesproducts.component.html',
  styleUrl: './homefeaturesproducts.component.scss'
})
export class HomefeaturesproductsComponent {
  products = [
    {
      emoji: '🍌',
      name: 'Chocobanano tradicional con manía',
      price: 7,
    },
    {
      emoji: '🍌',
      name: 'Chocobanano con chocolate de chicle y Oreo',
      price: 8,
    },
    {
      emoji: '🍌',
      name: 'Chocobanano de caramelo con manía',
      price: 8,
    },
    {
      emoji: '🍍',
      name: 'Chocopiña con chocolate blanco y coco',
      price: 8,
    },
    {
      emoji: '🍍',
      name: 'Chocopiña con chocolate blanco y anisillo',
      price: 8,
    },
    {
      emoji: '🍓',
      name: 'Chocofresa con chocolate de guinda y anisillo',
      price: 8,
    },
  ];
}

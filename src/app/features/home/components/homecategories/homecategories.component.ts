import { Component } from '@angular/core';
import {AnimateOnScrollModule} from 'primeng/animateonscroll';
import {CardModule} from 'primeng/card';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-homecategories',
  imports: [CommonModule, CardModule, AnimateOnScrollModule],
  templateUrl: './homecategories.component.html',
  styleUrl: './homecategories.component.scss'
})
export class HomeCategoriesComponent {
  categories = [
    {
      emoji: '🍓',
      title: 'Chocofrutas',
      desc: 'Frutas frescas cubiertas con el mejor chocolate',
      bg: 'bg-gradient-to-br from-[#D09162] to-[#6F3E1D]'
    },
    {
      emoji: '🍦',
      title: 'Helados',
      desc: 'Helados artesanales de frutas naturales',
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      emoji: '🌸',
      title: 'Floristería',
      desc: 'Arreglos florales para toda ocasión',
      bg: 'bg-gradient-to-br from-pink-400 to-pink-600'
    },
    {
      emoji: '🎉',
      title: 'Eventos',
      desc: 'Servicios especiales para tus celebraciones',
      bg: 'bg-gradient-to-br from-purple-400 to-purple-600'
    }
  ];
}

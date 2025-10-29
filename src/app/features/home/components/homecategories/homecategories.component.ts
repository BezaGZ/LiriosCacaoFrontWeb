import { Component } from '@angular/core';
import {AnimateOnScrollModule} from 'primeng/animateonscroll';
import {CardModule} from 'primeng/card';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homecategories',
  imports: [CommonModule, CardModule, AnimateOnScrollModule],
  templateUrl: './homecategories.component.html',
  styleUrl: './homecategories.component.scss'
})
export class HomeCategoriesComponent {
  constructor(private router: Router) {}

  categories = [
    {
      icon: 'pi-heart-fill',
      title: 'Chocofrutas',
      desc: 'Frutas frescas cubiertas con chocolate premium',
      color: '#8B4513',
      slug: 'chocofruta'
    },
    {
      icon: 'pi-sun',
      title: 'Helados',
      desc: 'Helados artesanales de frutas naturales',
      color: '#6B8E23',
      slug: 'helado'
    },
    {
      icon: 'pi-sparkles',
      title: 'Floristería',
      desc: 'Arreglos florales para toda ocasión',
      color: '#C71585',
      slug: 'flor'
    },
    {
      icon: 'pi-star-fill',
      title: 'Eventos',
      desc: 'Servicios especiales para celebraciones',
      color: '#8A2BE2',
      slug: 'evento'
    }
  ];

  goToCategory(slug: string) {
    this.router.navigate(['/productos'], { queryParams: { category: slug } });
  }
}

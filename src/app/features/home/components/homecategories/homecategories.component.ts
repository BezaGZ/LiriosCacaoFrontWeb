import { Component } from '@angular/core';
import {AnimateOnScrollModule} from 'primeng/animateonscroll';
import {CardModule} from 'primeng/card';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

interface Categoria {
  icon: string;
  title: string;
  desc: string;
  color: string;
  slug: string;
  /**
   * Ruta propia, para las secciones que ya no son un filtro del catalogo.
   * Sin esto la tarjeta va a /productos?category=<slug>.
   */
  ruta?: string;
}

@Component({
  selector: 'app-homecategories',
  imports: [CommonModule, CardModule, AnimateOnScrollModule],
  templateUrl: './homecategories.component.html',
  /*
    No se usa `grid grid-cols-2` de Tailwind aqui: PrimeFlex tambien define
    una clase `.grid` (display:flex) y termina ganando, asi que la cuadricula
    se rompia y las tarjetas quedaban una debajo de otra. Con una clase propia
    del componente no hay colision.
  */
  styles: [`
    .cat-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }
    @media (min-width: 768px) {
      .cat-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
      }
    }
  `],
})
export class HomeCategoriesComponent {
  constructor(private router: Router) {}

  categories: Categoria[] = [
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
      desc: 'Jardín, mobiliario, decoración, comida y sonido',
      color: '#8A2BE2',
      slug: 'evento',
      ruta: '/eventos'
    }
  ];

  irA(cat: Categoria): void {
    if (cat.ruta) {
      this.router.navigate([cat.ruta]);
      return;
    }
    this.router.navigate(['/productos'], { queryParams: { category: cat.slug } });
  }
}

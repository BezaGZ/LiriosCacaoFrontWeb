import { Routes } from '@angular/router';
import { Cascaron } from '@features/cascaron/cascaron';

export const routes: Routes = [
  {
    path: '',
    component: Cascaron,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'sobrenosotros',
        loadComponent: () =>
          import('./features/info/info.component').then((m) => m.InfoComponent),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
      },
      {
        // El configurador. Solo lo abren los productos que tienen
        // configuradorId; los demas entran al carrito desde la tarjeta.
        path: 'producto/:slug',
        loadComponent: () =>
          import('./features/producto/producto.component').then((m) => m.ProductoComponent),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./features/cart/page/cart-page.component').then((m) => m.CartPageComponent),
      }
    ],

  },


];

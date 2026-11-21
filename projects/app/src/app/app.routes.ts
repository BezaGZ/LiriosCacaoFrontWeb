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
          import('./features/listproducts/listproducts.component').then((m) => m.ListproductsComponent),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./features/cart/page/cart-page.component').then((m) => m.CartPageComponent),
      }
    ],

  },


];

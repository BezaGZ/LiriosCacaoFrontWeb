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
          import('./features/inicio/inicio.component').then((m) => m.InicioComponent),
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
        path: 'carrito',
        loadComponent: () =>
          import('./features/carrito/carrito.component').then((m) => m.CarritoComponent),
      }
    ],
  },

  // Flujos: se abren ENCIMA del cascaron y se cierran. No llevan barra de
  // pestanas ni barra de pedido, porque las suyas propias ya ocupan el pie y
  // tres barras apiladas abajo no caben en un telefono.
  {
    path: 'producto/:slug',
    loadComponent: () =>
      import('./features/producto/producto.component').then((m) => m.ProductoComponent),
  },
  {
    path: 'pedido',
    loadComponent: () =>
      import('./features/pedido/pedido.component').then((m) => m.PedidoComponent),
  },


];

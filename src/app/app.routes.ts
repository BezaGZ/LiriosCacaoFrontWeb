import { Routes } from '@angular/router';
import {AppLayout} from '@features/layout/components/app.layout/app.layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
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
    ],

  },

  {
    path: 'test',
    loadComponent: () =>
      import('./features/info/info.component').then((m) => m.InfoComponent),
  },

];

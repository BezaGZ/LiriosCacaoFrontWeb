import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Lirios y Cacao — Flores, chocofrutas y eventos en Chiquimula',
    loadComponent: () =>
      import('./features/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  { path: '**', redirectTo: '' },
];

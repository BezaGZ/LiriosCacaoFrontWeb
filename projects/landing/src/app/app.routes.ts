import { Routes } from '@angular/router';

/**
 * Los títulos NO van aquí: los pone SeoService desde cada componente, junto
 * con la descripción, el canonical y los datos estructurados. Si se pusieran
 * en la ruta, el router los escribiría encima después y ganarían estos.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'floristeria',
    loadComponent: () =>
      import('./features/floristeria/floristeria.component').then(
        (m) => m.FloristeriaComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];

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
    path: 'servicios',
    loadComponent: () =>
      import('./features/servicios/servicios.component').then(
        (m) => m.ServiciosComponent,
      ),
  },
  {
    path: 'jardin',
    loadComponent: () =>
      import('./features/jardin/jardin.component').then((m) => m.JardinComponent),
  },
  {
    path: 'floristeria',
    loadComponent: () =>
      import('./features/floristeria/floristeria.component').then(
        (m) => m.FloristeriaComponent,
      ),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./features/nosotros/nosotros.component').then(
        (m) => m.NosotrosComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];

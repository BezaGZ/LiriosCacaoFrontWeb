// Tipos: la forma de cada tabla.
export * from './catalogo.models';

// Datos quemados. Es lo unico que se va el dia del backend.
export * from './catalogo.datos';

// Motor de precios: funciones puras sobre las tablas.
export * from './catalogo.precio';

// La costura: la aplicacion pide FuenteCatalogo, no los datos.
export * from './catalogo.fuente';

import { CatalogoHeladosPaleta, SaborHelado } from './models';

// Todos precio 5
const P = 5;

const SABORES_PALETA: SaborHelado[] = [
  { id: 'pal_vino',        nombre: 'Vino',        precio: P, disponible: true },
  { id: 'pal_quetzal',     nombre: 'Sabores de quetzalteca (tamarindo, jamaica, mora, naranja)', precio: P, disponible: true },
  { id: 'pal_melocoton',   nombre: 'Melocotón',   precio: P, disponible: true },
  { id: 'pal_coctel',      nombre: 'Coctel de frutas', precio: P, disponible: true },
  { id: 'pal_oreo',        nombre: 'Oreo',        precio: P, disponible: true },
  { id: 'pal_cafe',        nombre: 'Café espreso',precio: P, disponible: true },
  { id: 'pal_chocolate',   nombre: 'Chocolate',   precio: P, disponible: true },
  { id: 'pal_pina_colada', nombre: 'Piña colada', precio: P, disponible: true },
  { id: 'pal_mania',       nombre: 'Manía',       precio: P, disponible: true },
];

export const HELADOS_PALETA_SEED: CatalogoHeladosPaleta = {
  tipo: 'paleta',
  sabores: SABORES_PALETA,
};

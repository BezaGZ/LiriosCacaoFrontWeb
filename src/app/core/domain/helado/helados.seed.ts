import {CatalogoHelado, SaborHelado} from './helado.models';

const P = 8;

const SABORES_PALETA: SaborHelado[] = [
  { id: 'pal_vino',        nombre: 'Vino',        slug: 'vino',         precio: P, disponible: true },
  { id: 'pal_quetzal',     nombre: 'Sabores de quetzalteca (tamarindo, jamaica, mora, naranja)', slug: 'sabores-quetzalteca', precio: P, disponible: true },
  { id: 'pal_melocoton',   nombre: 'Melocotón',   slug: 'melocoton',    precio: P, disponible: true },
  { id: 'pal_coctel',      nombre: 'Coctel de frutas', slug: 'coctel-frutas', precio: P, disponible: true },
  { id: 'pal_oreo',        nombre: 'Oreo',        slug: 'oreo',         precio: P, disponible: true },
  { id: 'pal_cafe',        nombre: 'Café espreso',slug: 'cafe-espresso',precio: P, disponible: true },
  { id: 'pal_chocolate',   nombre: 'Chocolate',   slug: 'chocolate',    precio: P, disponible: true },
  { id: 'pal_pina_colada', nombre: 'Piña colada', slug: 'pina-colada',  precio: P, disponible: true },
  { id: 'pal_mania',       nombre: 'Manía',       slug: 'mania',        precio: P, disponible: true },
];

// Reemplaza HELADOS_PALETA_SEED por HELADO_SEED
export const HELADO_SEED: CatalogoHelado = {
  tipo: 'paleta',
  sabores: SABORES_PALETA,
  // --- AÑADIMOS LAS REGLAS DE PRECIOS ---
  reglas: {
    recargoChocolate: 2, // Ejemplo: Bañar en chocolate cuesta Q3 extra
    recargoTopping: 2,
    recargoChocolateExtra: 2 // Ejemplo: Cada topping cuesta Q2 extra
  },
};

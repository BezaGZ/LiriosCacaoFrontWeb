import { CHOCOFRUTA_SEED } from '@core/domain';
import { FeaturedPreset } from './featured.models';

const F = (slug: string) => CHOCOFRUTA_SEED.frutas.find(f => f.slug === slug)!;
const C = (colorSlug: string) => CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === colorSlug)!;
const T = (id: string) => CHOCOFRUTA_SEED.toppings.find(t => t.id === id)!;

export const FEATURED_PRESETS: FeaturedPreset[] = [
  {
    id: 'dest_1',
    titulo: 'Chocopiña chicle + angelitos',
    fruta: F('pina'),
    chocolate: C('celeste'),      // chicle
    toppings: [T('top_angelitos')]
  },
  {
    id: 'dest_2',
    titulo: 'Chocobanano tradicional con manía',
    fruta: F('banano'),
    chocolate: C('cafe'),
    toppings: [T('top_mania')],
  },
  {
    id: 'dest_3',
    titulo: 'Chocobanano chicle + Oreo',
    fruta: F('banano'),
    chocolate: C('celeste'),
    toppings: [T('top_oreo')],
  },
  {
    id: 'dest_4',
    titulo: 'Chocobanano caramelo + manía',
    fruta: F('banano'),
    chocolate: C('beige'),
    toppings: [T('top_mania')],
  },
  {
    id: 'dest_5',
    titulo: 'Chocopiña blanco + coco',
    fruta: F('pina'),
    chocolate: C('blanco'),
    toppings: [T('top_coco')],
  },
  {
    id: 'dest_6',
    titulo: 'Chocofresa guinda + angelitos',
    fruta: F('fresa'),
    chocolate: C('rosa'),
    toppings: [T('top_angelitos')],
  },
];

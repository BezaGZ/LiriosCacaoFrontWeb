import { CatalogoChocofruta, Fruta, Chocolate, Topping } from './chocofruta.models';

const FRUTAS: Fruta[] = [
  { id: 'fru_manzana',   nombre: 'Manzana',   slug: 'manzana',   imagenBase: 'assets/chocofruta/manzana_tradicional.png',  disponible: true },
  { id: 'fru_fresa',     nombre: 'Fresa',     slug: 'fresa',     imagenBase: 'assets/chocofruta/fresa_tradicional.png',    disponible: true },
  { id: 'fru_pina',      nombre: 'Piña',      slug: 'pina',      imagenBase: 'assets/chocofruta/pina_tradicional.png',     disponible: true },
  { id: 'fru_melon',     nombre: 'Melón',     slug: 'melon',     imagenBase: 'assets/chocofruta/melon_tradicional.png',    disponible: true },
  { id: 'fru_melocoton', nombre: 'Melocotón', slug: 'melocoton', imagenBase: 'assets/chocofruta/melocoton_tradicional.png',disponible: true },
  { id: 'fru_banano',    nombre: 'Banano',    slug: 'banano',    imagenBase: 'assets/chocofruta/banano_tradicional.png',   disponible: true },
  { id: 'fru_sandia',    nombre: 'Sandía',    slug: 'sandia',    imagenBase: 'assets/chocofruta/sandia_tradicional.png',   disponible: true },
  { id: 'fru_uva',       nombre: 'Uva',       slug: 'uva',       imagenBase: 'assets/chocofruta/uva_tradicional.png',      disponible: true },
];

const CHOCOLATES: Chocolate[] = [
  { id: 'choc_guinda',      nombre: 'Guinda',      color: 'rosa',    colorSlug: 'rosa',    esTradicional: false, disponible: true },
  { id: 'choc_chicle',      nombre: 'Chicle',      color: 'celeste', colorSlug: 'celeste', esTradicional: false, disponible: true },
  { id: 'choc_caramelo',    nombre: 'Caramelo',    color: 'beige',   colorSlug: 'beige',   esTradicional: false, disponible: true },
  { id: 'choc_tradicional', nombre: 'Tradicional', color: 'cafe',    colorSlug: 'cafe',    esTradicional: true,  disponible: true },
  { id: 'choc_blanco',      nombre: 'Blanco',      color: 'blanco',  colorSlug: 'blanco',  esTradicional: false, disponible: true },
];

const TOPPINGS: Topping[] = [
  { id: 'top_oreo',        nombre: 'Galleta oreo',         disponible: true },
  { id: 'top_chispitas',   nombre: 'Chispitas de colores', disponible: true },
  { id: 'top_mania',       nombre: 'Manía',                disponible: true },
  { id: 'top_chocokrispy', nombre: 'Chocokrispy',          disponible: true },
  { id: 'top_coco',        nombre: 'Coco rayado',          disponible: true },
  { id: 'top_angelitos',   nombre: 'Angelitos',            disponible: true },
  { id: 'top_kitkat',      nombre: 'Cereal kit kat',       disponible: true },
  { id: 'top_frootloops',  nombre: 'Frootlops',            disponible: true },
];

export const CHOCOFRUTA_SEED: CatalogoChocofruta = {
  frutas: FRUTAS,
  chocolates: CHOCOLATES,
  toppings: TOPPINGS,
  reglas: {
    baseConHastaUnTopping: 7,
    recargoChocolateNoTradicional: 1,
    recargoToppingExtra: 2,
    recargoDobleChocolate: 2,
  },
};

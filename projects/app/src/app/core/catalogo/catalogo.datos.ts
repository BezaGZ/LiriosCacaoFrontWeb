/**
 * Los datos del catalogo, quemados.
 *
 * Este archivo es lo UNICO que desaparece cuando entre el backend o el Excel:
 * los tipos, el motor de precios y el resto de la aplicacion no se tocan. Por
 * eso aqui no hay logica, solo filas.
 *
 * Al pasar a hoja de calculo, cada arreglo exportado de aqui es una hoja y
 * cada objeto una fila. El README de esta carpeta tiene las columnas.
 *
 * Convenciones:
 *   - `precio: null` es una celda vacia: todavia no hay precio.
 *   - `imagen: null` es que no hay fotografia tomada.
 *   - Las rutas de imagen son relativas a la raiz publica del proyecto.
 */

import {
  Ajuste, Capa, Catalogo, Categoria, Configurador, Grupo, Id, Opcion,
  Paquete, Producto,
} from './catalogo.models';

// ---------------------------------------------------------------------------
// Hoja: categorias
// ---------------------------------------------------------------------------

export const CATEGORIAS: readonly Categoria[] = [
  { id: 'cat_chocofruta', slug: 'chocofrutas', nombre: 'Chocofrutas', icono: 'chocofruta', orden: 1, disponible: true },
  { id: 'cat_helado',     slug: 'helados',     nombre: 'Helados',     icono: 'paleta',     orden: 2, disponible: true },
  { id: 'cat_bebida',     slug: 'bebidas',     nombre: 'Bebidas',     icono: 'vaso',       orden: 3, disponible: true },
  { id: 'cat_paquete',    slug: 'paquetes',    nombre: 'Paquetes',    icono: 'caja',       orden: 4, disponible: true },
  // Existe la categoria pero todavia no hay nada adentro: por eso no se muestra.
  { id: 'cat_comida',     slug: 'comida',      nombre: 'Comida',      icono: 'cubiertos',  orden: 5, disponible: false },
];

// ---------------------------------------------------------------------------
// Hoja: productos
// ---------------------------------------------------------------------------

// La chocofruta cuesta lo mismo lleve el chocolate que lleve: los cinco
// colores entran en estos Q10. Lo unico que sube el precio es un SEGUNDO
// bano (el extra de doble chocolate) o un topping despues del primero.
const BASE_CHOCOFRUTA = 10;
const BASE_PALETA = 10;

/**
 * La foto de la tarjeta del catalogo. Viven todas juntas en una sola carpeta
 * y con un solo nombre por producto, a diferencia de las de `capas`, que
 * dependen de la combinacion de fruta y chocolate.
 */
const foto = (archivo: string) => `assets/img/productos/${archivo}.webp`;

export const PRODUCTOS: readonly Producto[] = [
  // --- Chocofrutas: las ocho de chocofruta.seed.ts -------------------------
  // Solo banano, pina y sandia tienen fotografia en el repositorio. Las demas
  // llevan null hasta que exista el archivo: nada apunta a una ruta vacia.
  { id: 'prod_manzana', categoriaId: 'cat_chocofruta', slug: 'chocomanzana', nombre: 'Chocomanzana',
    descripcion: 'Trozos de manzana cubiertos de chocolate', precio: BASE_CHOCOFRUTA, imagen: foto('chocomanzana'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 1, disponible: true },

  { id: 'prod_fresa', categoriaId: 'cat_chocofruta', slug: 'chocofresa', nombre: 'Chocofresa',
    descripcion: 'Fresa cubierta de chocolate', precio: BASE_CHOCOFRUTA, imagen: foto('chocofresa'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 2, disponible: true },

  { id: 'prod_pina', categoriaId: 'cat_chocofruta', slug: 'chocopina', nombre: 'Chocopiña',
    descripcion: 'Trozos de piña fresca cubiertos de chocolate', precio: BASE_CHOCOFRUTA,
    imagen: foto('chocopina'),
    configuradorId: 'cfg_chocofruta', sello: 'Más pedido', destacado: true, orden: 3, disponible: true },

  { id: 'prod_melon', categoriaId: 'cat_chocofruta', slug: 'chocomelon', nombre: 'Chocomelón',
    descripcion: 'Trozos de melón cubiertos de chocolate', precio: BASE_CHOCOFRUTA, imagen: foto('chocomelon'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 4, disponible: true },

  { id: 'prod_melocoton', categoriaId: 'cat_chocofruta', slug: 'chocomelocoton', nombre: 'Chocomelocotón',
    descripcion: 'Trozos de melocotón cubiertos de chocolate', precio: BASE_CHOCOFRUTA, imagen: foto('chocomelocoton'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 5, disponible: true },

  { id: 'prod_banano', categoriaId: 'cat_chocofruta', slug: 'chocobanano', nombre: 'Chocobanano',
    descripcion: 'Banano cubierto de chocolate', precio: BASE_CHOCOFRUTA,
    imagen: foto('chocobanano'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: true, orden: 6, disponible: true },

  { id: 'prod_sandia', categoriaId: 'cat_chocofruta', slug: 'chocosandia', nombre: 'Chocosandía',
    descripcion: 'Trozos de sandía cubiertos de chocolate', precio: BASE_CHOCOFRUTA,
    imagen: foto('chocosandia'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: true, orden: 7, disponible: true },

  { id: 'prod_uva', categoriaId: 'cat_chocofruta', slug: 'chocouva', nombre: 'Chocouva',
    descripcion: 'Uvas cubiertas de chocolate', precio: BASE_CHOCOFRUTA, imagen: foto('chocouva'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 8, disponible: true },

  { id: 'prod_mix', categoriaId: 'cat_chocofruta', slug: 'chocomix', nombre: 'Chocomix',
    descripcion: 'Varias frutas cubiertas de chocolate', precio: BASE_CHOCOFRUTA, imagen: foto('chocomix'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 9, disponible: true },

  // --- Paletas: doce ------------------------------------------------------
  // Las ocho propias mas los cuatro sabores de quetzalteca, que antes vivian
  // apretados en un solo producto y el cliente no podia pedir uno solo.
  { id: 'prod_pal_vino', categoriaId: 'cat_helado', slug: 'paleta-vino', nombre: 'Paleta de vino',
    descripcion: 'Paleta de crema sabor vino', precio: BASE_PALETA, imagen: foto('heladovino'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 1, disponible: true },

  { id: 'prod_pal_tamarindo', categoriaId: 'cat_helado', slug: 'paleta-tamarindo', nombre: 'Paleta de tamarindo',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: foto('heladoquetzaltecatamarindo_botella'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 2, disponible: true },

  { id: 'prod_pal_jamaica', categoriaId: 'cat_helado', slug: 'paleta-jamaica', nombre: 'Paleta de jamaica',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: foto('heladoquetzaltecajamaica_botella'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 3, disponible: true },

  { id: 'prod_pal_mora', categoriaId: 'cat_helado', slug: 'paleta-mora', nombre: 'Paleta de mora',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: foto('heladoquetzaltecamora_botella'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 4, disponible: true },

  { id: 'prod_pal_naranja', categoriaId: 'cat_helado', slug: 'paleta-naranja', nombre: 'Paleta de naranja',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: foto('heladoquetzaltecanaranja_botella'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 5, disponible: true },

  { id: 'prod_pal_melocoton', categoriaId: 'cat_helado', slug: 'paleta-melocoton', nombre: 'Paleta de melocotón',
    descripcion: 'Paleta de crema sabor melocotón', precio: BASE_PALETA, imagen: foto('heladomelocoton'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 6, disponible: true },

  { id: 'prod_pal_coctel', categoriaId: 'cat_helado', slug: 'paleta-coctel-frutas', nombre: 'Coctel de frutas',
    descripcion: 'Paleta con trozos de fruta', precio: BASE_PALETA, imagen: foto('heladococteldefrutas'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 7, disponible: true },

  { id: 'prod_pal_oreo', categoriaId: 'cat_helado', slug: 'paleta-oreo', nombre: 'Paleta de oreo',
    descripcion: 'Paleta de crema con galleta oreo', precio: BASE_PALETA, imagen: foto('heladooreo'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 8, disponible: true },

  { id: 'prod_pal_cafe', categoriaId: 'cat_helado', slug: 'paleta-cafe-espreso', nombre: 'Paleta de café espreso',
    descripcion: 'Paleta de crema sabor café', precio: BASE_PALETA, imagen: foto('heladocafeexpreso'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 9, disponible: true },

  { id: 'prod_pal_chocolate', categoriaId: 'cat_helado', slug: 'paleta-chocolate', nombre: 'Paleta de chocolate',
    descripcion: 'Paleta de crema de chocolate', precio: BASE_PALETA, imagen: foto('heladochocolate'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 10, disponible: true },

  { id: 'prod_pal_pina_colada', categoriaId: 'cat_helado', slug: 'paleta-pina-colada', nombre: 'Piña colada',
    descripcion: 'Paleta de piña con coco', precio: BASE_PALETA, imagen: foto('heladopinacolada'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 11, disponible: true },

  { id: 'prod_pal_mania', categoriaId: 'cat_helado', slug: 'paleta-mania', nombre: 'Paleta de manía',
    descripcion: 'Paleta de crema con manía', precio: BASE_PALETA, imagen: foto('heladomania'),
    configuradorId: 'cfg_paleta', sello: '', destacado: false, orden: 12, disponible: true },

  // --- Bebidas: ocho cafes frios, vaso de 16 oz ---------------------------
  // Un solo tamano, asi que no llevan configurador: se agregan directo.
  // Sin precio todavia: por eso van en null y como no disponibles.
  { id: 'prod_beb_vanilla', categoriaId: 'cat_bebida', slug: 'vanilla-cloud', nombre: 'Vanilla Cloud',
    descripcion: 'Suave · 16 oz', precio: null, imagen: foto('cafevainillacloud'),
    configuradorId: null, sello: '', destacado: false, orden: 1, disponible: false },

  { id: 'prod_beb_caramel', categoriaId: 'cat_bebida', slug: 'caramel-kiss', nombre: 'Caramel Kiss',
    descripcion: 'Dulce · 16 oz', precio: null, imagen: foto('cafecaramelkiss'),
    configuradorId: null, sello: '', destacado: false, orden: 2, disponible: false },

  { id: 'prod_beb_chocomood', categoriaId: 'cat_bebida', slug: 'chocolate-mood', nombre: 'Chocolate Mood',
    descripcion: 'Chocolatoso · 16 oz', precio: null, imagen: foto('cafechocolatemood'),
    configuradorId: null, sello: '', destacado: false, orden: 3, disponible: false },

  { id: 'prod_beb_blackvelvet', categoriaId: 'cat_bebida', slug: 'black-velvet', nombre: 'Black Velvet',
    descripcion: 'Intenso · 16 oz', precio: null, imagen: foto('cafeblackvelvet'),
    configuradorId: null, sello: '', destacado: false, orden: 4, disponible: false },

  { id: 'prod_beb_whiteromance', categoriaId: 'cat_bebida', slug: 'white-romance', nombre: 'White Romance',
    descripcion: 'Cremoso · 16 oz', precio: null, imagen: foto('cafewhiteromance'),
    configuradorId: null, sello: '', destacado: false, orden: 5, disponible: false },

  { id: 'prod_beb_hazelnut', categoriaId: 'cat_bebida', slug: 'hazelnut-dream', nombre: 'Hazelnut Dream',
    descripcion: 'Tostado · 16 oz', precio: null, imagen: foto('cafehazelnutdream'),
    configuradorId: null, sello: '', destacado: false, orden: 6, disponible: false },

  { id: 'prod_beb_tentacion', categoriaId: 'cat_bebida', slug: 'dulce-tentacion', nombre: 'Dulce Tentación',
    descripcion: 'Acaramelado · 16 oz', precio: null, imagen: foto('dulcetentacion'),
    configuradorId: null, sello: '', destacado: false, orden: 7, disponible: false },

  { id: 'prod_beb_pinkaffair', categoriaId: 'cat_bebida', slug: 'pink-affair', nombre: 'Pink Affair',
    descripcion: 'Frutal · 16 oz', precio: null, imagen: foto('cafepinkaffair'),
    configuradorId: null, sello: '', destacado: false, orden: 8, disponible: false },
];

// ---------------------------------------------------------------------------
// Hoja: configuradores
// ---------------------------------------------------------------------------

export const CONFIGURADORES: readonly Configurador[] = [
  { id: 'cfg_chocofruta', nombre: 'Armado de chocofruta' },
  { id: 'cfg_paleta', nombre: 'Armado de paleta' },
];

// ---------------------------------------------------------------------------
// Hoja: grupos
// ---------------------------------------------------------------------------

export const GRUPOS: readonly Grupo[] = [
  // El chocolate que se elija va incluido en el precio: los cinco cuestan 0.
  // Por eso `incluidas: 1`, que es lo que dice "uno entra en el precio".
  { id: 'grp_chocolate', configuradorId: 'cfg_chocofruta', nombre: 'Chocolate',
    ayuda: 'elija uno, va incluido', tipo: 'uno', obligatorio: true, incluidas: 1, maximo: null,
    tomaOpcionesDe: null, visible: true, orden: 1 },

  // Aqui si: la primera va incluida y de ahi cada una suma Q2. Subir el
  // incluido a dos es cambiar este 1 por un 2, sin tocar codigo.
  { id: 'grp_toppings', configuradorId: 'cfg_chocofruta', nombre: 'Toppings',
    ayuda: 'el primero va incluido', tipo: 'varios', obligatorio: false, incluidas: 1, maximo: null,
    tomaOpcionesDe: null, visible: true, orden: 2 },

  { id: 'grp_extra', configuradorId: 'cfg_chocofruta', nombre: 'Extra',
    ayuda: 'opcional', tipo: 'varios', obligatorio: false, incluidas: 0, maximo: null,
    tomaOpcionesDe: null, visible: true, orden: 3 },

  // Los dos de abajo no se dibujan solos: los abre una opcion. Y no repiten
  // los cinco chocolates, los toman prestados sin cobrar.
  { id: 'grp_color_lineas', configuradorId: 'cfg_chocofruta', nombre: 'Color de las líneas',
    ayuda: '', tipo: 'uno', obligatorio: true, incluidas: 0, maximo: null,
    tomaOpcionesDe: 'grp_chocolate', visible: false, orden: 4 },

  { id: 'grp_color_doble', configuradorId: 'cfg_chocofruta', nombre: 'Color del segundo baño',
    ayuda: '', tipo: 'uno', obligatorio: true, incluidas: 0, maximo: null,
    tomaOpcionesDe: 'grp_chocolate', visible: false, orden: 5 },

  // La paleta va SIN chocolate, al reves que la chocofruta: aqui la primera
  // capa ya se cobra. Por eso `incluidas: 0` y por eso la lista arranca con
  // "Sin chocolate", que cuesta 0 y es lo que queda puesto por omision: sin
  // esa fila el cliente no tendria como volver a quitarselo.
  { id: 'grp_choco_paleta', configuradorId: 'cfg_paleta', nombre: 'Chocolate',
    ayuda: 'opcional', tipo: 'uno', obligatorio: true, incluidas: 0, maximo: null,
    tomaOpcionesDe: null, visible: true, orden: 1 },

  // Aqui tampoco va ninguno incluido: en la paleta todo lo que se agrega
  // cuesta Q2, el chocolate y cada topping por igual.
  { id: 'grp_top_paleta', configuradorId: 'cfg_paleta', nombre: 'Toppings',
    ayuda: 'cada uno aparte', tipo: 'varios', obligatorio: false, incluidas: 0, maximo: null,
    tomaOpcionesDe: null, visible: true, orden: 2 },

  // El color de las lineas toma prestados los chocolates de la CHOCOFRUTA y
  // no los de la paleta: prestar ya los deja en cero, y la lista de la paleta
  // arranca con "Sin chocolate", que como color de una linea no significa
  // nada.
  { id: 'grp_color_lineas_paleta', configuradorId: 'cfg_paleta', nombre: 'Color de las líneas',
    ayuda: '', tipo: 'uno', obligatorio: true, incluidas: 0, maximo: null,
    tomaOpcionesDe: 'grp_chocolate', visible: false, orden: 3 },
];

// ---------------------------------------------------------------------------
// Hoja: opciones
// ---------------------------------------------------------------------------

const EXTRA_TOPPING = 2;
const CHOCOLATE_EN_PALETA = 2;

export const OPCIONES: readonly Opcion[] = [
  // --- Chocolates ---------------------------------------------------------
  { id: 'opt_choco_guinda', grupoId: 'grp_chocolate', slug: 'guinda', nombre: 'Guinda',
    precioExtra: 0, color: '#e4849f', imagen: null, abreGrupoId: null, orden: 1, disponible: true },
  { id: 'opt_choco_chicle', grupoId: 'grp_chocolate', slug: 'chicle', nombre: 'Chicle',
    precioExtra: 0, color: '#9ecfe8', imagen: null, abreGrupoId: null, orden: 2, disponible: true },
  { id: 'opt_choco_caramelo', grupoId: 'grp_chocolate', slug: 'caramelo', nombre: 'Caramelo',
    precioExtra: 0, color: '#d9b38c', imagen: null, abreGrupoId: null, orden: 3, disponible: true },
  { id: 'opt_choco_tradicional', grupoId: 'grp_chocolate', slug: 'tradicional', nombre: 'Tradicional',
    precioExtra: 0, color: '#6b4226', imagen: null, abreGrupoId: null, orden: 4, disponible: true },
  { id: 'opt_choco_blanco', grupoId: 'grp_chocolate', slug: 'blanco', nombre: 'Blanco',
    precioExtra: 0, color: '#f5ede2', imagen: null, abreGrupoId: null, orden: 5, disponible: true },

  // --- Toppings -----------------------------------------------------------
  { id: 'opt_top_oreo', grupoId: 'grp_toppings', slug: 'galleta-oreo', nombre: 'Galleta oreo',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 1, disponible: true },
  { id: 'opt_top_chispitas', grupoId: 'grp_toppings', slug: 'chispitas-de-colores', nombre: 'Chispitas de colores',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 2, disponible: true },
  { id: 'opt_top_mania', grupoId: 'grp_toppings', slug: 'mania', nombre: 'Manía',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 3, disponible: true },
  { id: 'opt_top_chocokrispy', grupoId: 'grp_toppings', slug: 'chocokrispy', nombre: 'Chocokrispy',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 4, disponible: true },
  { id: 'opt_top_coco', grupoId: 'grp_toppings', slug: 'coco-rayado', nombre: 'Coco rayado',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 5, disponible: true },
  { id: 'opt_top_angelitos', grupoId: 'grp_toppings', slug: 'angelitos', nombre: 'Angelitos',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 6, disponible: true },
  { id: 'opt_top_kitkat', grupoId: 'grp_toppings', slug: 'cereal-kit-kat', nombre: 'Cereal kit kat',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 7, disponible: true },
  { id: 'opt_top_frootloops', grupoId: 'grp_toppings', slug: 'frootloops', nombre: 'Frootloops',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 8, disponible: true },
  // La unica que abre otro grupo: unas lineas del mismo color del bano no se
  // verian, asi que al marcarla se pregunta el color.
  { id: 'opt_top_lineas', grupoId: 'grp_toppings', slug: 'lineas-de-chocolate', nombre: 'Líneas de chocolate',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: 'grp_color_lineas', orden: 9, disponible: true },

  // --- Chocolate de la paleta ---------------------------------------------
  // No son las mismas filas de arriba a proposito: en la chocofruta el
  // chocolate va incluido y aqui cuesta Q2. Un grupo prestado no servia,
  // porque prestar una opcion le quita el precio.
  { id: 'opt_pal_sin', grupoId: 'grp_choco_paleta', slug: 'sin-chocolate', nombre: 'Sin chocolate',
    precioExtra: 0, color: null, imagen: null, abreGrupoId: null, orden: 1, disponible: true },
  { id: 'opt_pal_tradicional', grupoId: 'grp_choco_paleta', slug: 'tradicional', nombre: 'Tradicional',
    precioExtra: CHOCOLATE_EN_PALETA, color: '#6b4226', imagen: null, abreGrupoId: null, orden: 2, disponible: true },
  { id: 'opt_pal_guinda', grupoId: 'grp_choco_paleta', slug: 'guinda', nombre: 'Guinda',
    precioExtra: CHOCOLATE_EN_PALETA, color: '#e4849f', imagen: null, abreGrupoId: null, orden: 3, disponible: true },
  { id: 'opt_pal_chicle', grupoId: 'grp_choco_paleta', slug: 'chicle', nombre: 'Chicle',
    precioExtra: CHOCOLATE_EN_PALETA, color: '#9ecfe8', imagen: null, abreGrupoId: null, orden: 4, disponible: true },
  { id: 'opt_pal_caramelo', grupoId: 'grp_choco_paleta', slug: 'caramelo', nombre: 'Caramelo',
    precioExtra: CHOCOLATE_EN_PALETA, color: '#d9b38c', imagen: null, abreGrupoId: null, orden: 5, disponible: true },
  { id: 'opt_pal_blanco', grupoId: 'grp_choco_paleta', slug: 'blanco', nombre: 'Blanco',
    precioExtra: CHOCOLATE_EN_PALETA, color: '#f5ede2', imagen: null, abreGrupoId: null, orden: 6, disponible: true },

  // --- Toppings de la paleta ----------------------------------------------
  // Los mismos nueve de la chocofruta, pero sin el primero incluido.
  { id: 'opt_paltop_oreo', grupoId: 'grp_top_paleta', slug: 'galleta-oreo', nombre: 'Galleta oreo',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 1, disponible: true },
  { id: 'opt_paltop_chispitas', grupoId: 'grp_top_paleta', slug: 'chispitas-de-colores', nombre: 'Chispitas de colores',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 2, disponible: true },
  { id: 'opt_paltop_mania', grupoId: 'grp_top_paleta', slug: 'mania', nombre: 'Manía',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 3, disponible: true },
  { id: 'opt_paltop_chocokrispy', grupoId: 'grp_top_paleta', slug: 'chocokrispy', nombre: 'Chocokrispy',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 4, disponible: true },
  { id: 'opt_paltop_coco', grupoId: 'grp_top_paleta', slug: 'coco-rayado', nombre: 'Coco rayado',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 5, disponible: true },
  { id: 'opt_paltop_angelitos', grupoId: 'grp_top_paleta', slug: 'angelitos', nombre: 'Angelitos',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 6, disponible: true },
  { id: 'opt_paltop_kitkat', grupoId: 'grp_top_paleta', slug: 'cereal-kit-kat', nombre: 'Cereal kit kat',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 7, disponible: true },
  { id: 'opt_paltop_frootloops', grupoId: 'grp_top_paleta', slug: 'frootloops', nombre: 'Frootloops',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: null, orden: 8, disponible: true },
  { id: 'opt_paltop_lineas', grupoId: 'grp_top_paleta', slug: 'lineas-de-chocolate', nombre: 'Líneas de chocolate',
    precioExtra: EXTRA_TOPPING, color: null, imagen: null, abreGrupoId: 'grp_color_lineas_paleta', orden: 9, disponible: true },

  // --- Extra --------------------------------------------------------------
  { id: 'opt_extra_doble', grupoId: 'grp_extra', slug: 'doble-chocolate', nombre: 'Doble chocolate',
    precioExtra: 2, color: null, imagen: null, abreGrupoId: 'grp_color_doble', orden: 1, disponible: true },
];

// ---------------------------------------------------------------------------
// Hoja: capas (fotografia por combinacion)
// ---------------------------------------------------------------------------

/**
 * Las 42 imagenes que SI existen hoy en el repositorio: 15 bases de color y
 * 27 capas de topping, todas de banano, pina y sandia.
 *
 * Esta tabla es la que dice la verdad sobre la fotografia: una combinacion
 * sin fila aqui simplemente muestra la foto base del producto. Por eso las
 * cinco frutas sin fotos no rompen nada, y completar una fruta es agregar
 * filas, nunca tocar codigo.
 *
 * En la hoja de calculo son 42 filas de cuatro columnas. Aqui se arman con
 * dos bucles para no escribir la misma ruta cuarenta y dos veces.
 */
const FRUTAS_FOTOGRAFIADAS: readonly { productoId: Id; carpeta: string }[] = [
  { productoId: 'prod_banano', carpeta: 'banano' },
  { productoId: 'prod_pina', carpeta: 'pina' },
  { productoId: 'prod_sandia', carpeta: 'sandia' },
];

/** El nombre del archivo no coincide con el slug, asi que va escrito. */
const ARCHIVO_CHOCOLATE: readonly { opcionId: Id; sufijo: string }[] = [
  { opcionId: 'opt_choco_blanco', sufijo: 'blanco' },
  { opcionId: 'opt_choco_caramelo', sufijo: 'caramelo' },
  { opcionId: 'opt_choco_chicle', sufijo: 'chicle' },
  { opcionId: 'opt_choco_guinda', sufijo: 'guinda' },
  { opcionId: 'opt_choco_tradicional', sufijo: 'tradicional' },
];

/** 'frootlops' esta asi en el repositorio: es el nombre real del archivo. */
const ARCHIVO_TOPPING: readonly { opcionId: Id; sufijo: string }[] = [
  { opcionId: 'opt_top_angelitos', sufijo: 'angelitos' },
  { opcionId: 'opt_top_kitkat', sufijo: 'cerealkitkat' },
  { opcionId: 'opt_top_chispitas', sufijo: 'chispitasdecolores' },
  { opcionId: 'opt_top_chocokrispy', sufijo: 'chocokrispy' },
  { opcionId: 'opt_top_coco', sufijo: 'cocorayado' },
  { opcionId: 'opt_top_frootloops', sufijo: 'frootlops' },
  { opcionId: 'opt_top_oreo', sufijo: 'galletaoreo' },
  { opcionId: 'opt_top_lineas', sufijo: 'lineasdechocolate' },
  { opcionId: 'opt_top_mania', sufijo: 'mania' },
];

export const CAPAS: readonly Capa[] = FRUTAS_FOTOGRAFIADAS.flatMap((f) => [
  ...ARCHIVO_CHOCOLATE.map((c): Capa => ({
    productoId: f.productoId,
    opcionId: c.opcionId,
    tipo: 'base',
    imagen: `assets/img/chocos/${f.carpeta}/choco${f.carpeta}${c.sufijo}.png`,
  })),
  ...ARCHIVO_TOPPING.map((t): Capa => ({
    productoId: f.productoId,
    opcionId: t.opcionId,
    tipo: 'encima',
    imagen: `assets/img/chocos/${f.carpeta}/toppings/${f.carpeta}${t.sufijo}.png`,
  })),
]);

// ---------------------------------------------------------------------------
// Hoja: paquetes
// ---------------------------------------------------------------------------

export const PAQUETES: readonly Paquete[] = [
  // El escalon: hasta ocho no hay descuento y lo que se regala es el empaque.
  // De quince para arriba lo que se regala son unidades, y cada paquete mas
  // grande sale mas barato por unidad que el anterior. Romper ese orden es el
  // error facil de cometer: un paquete intermedio con una gratis dejaria al
  // siguiente viendose peor que el. La prueba de catalogo.precio.spec lo cuida.
  { id: 'paq_cuatro', slug: 'caja-de-4', nombre: 'Caja de 4',
    descripcion: '4 chocofrutas a elegir',
    categoriaId: 'cat_chocofruta', cantidad: 4, desde: false, gratis: 0,
    empaque: '', precio: 40, sello: '', orden: 1, disponible: true },

  { id: 'paq_ocho', slug: 'paquete-de-8', nombre: 'Paquete de 8',
    descripcion: '8 chocofrutas a elegir, en empaque premium',
    categoriaId: 'cat_chocofruta', cantidad: 8, desde: false, gratis: 0,
    empaque: 'premium', precio: 80, sello: 'Empaque gratis', orden: 2, disponible: true },

  { id: 'paq_fiesta', slug: 'paquete-fiesta', nombre: 'Paquete fiesta',
    descripcion: 'Desde 15 chocofrutas y la siguiente va gratis',
    categoriaId: 'cat_chocofruta', cantidad: 15, desde: true, gratis: 1,
    empaque: '', precio: 150, sello: '+1 gratis', orden: 3, disponible: true },

  { id: 'paq_cumpleanos', slug: 'paquete-cumpleanos', nombre: 'Paquete cumpleaños',
    descripcion: '25 chocofrutas a elegir y 3 van gratis, en empaque premium',
    categoriaId: 'cat_chocofruta', cantidad: 25, desde: false, gratis: 3,
    empaque: 'premium', precio: 250, sello: '+3 gratis', orden: 4, disponible: true },

  { id: 'paq_evento', slug: 'paquete-evento', nombre: 'Paquete evento',
    descripcion: '50 chocofrutas a elegir y 8 van gratis',
    categoriaId: 'cat_chocofruta', cantidad: 50, desde: false, gratis: 8,
    empaque: '', precio: 500, sello: '+8 gratis', orden: 5, disponible: true },

  // El unico que no es de chocofruta: las fotos y lo que se elige adentro
  // salen de la categoria, asi que una fila basta para abrir las paletas.
  { id: 'paq_paletas_ocho', slug: 'paquete-de-8-paletas', nombre: 'Paquete de 8 paletas',
    descripcion: '8 paletas a elegir, en empaque',
    categoriaId: 'cat_helado', cantidad: 8, desde: false, gratis: 0,
    empaque: 'caja', precio: 80, sello: 'Empaque gratis', orden: 6, disponible: true },
];

// ---------------------------------------------------------------------------
// Hoja: ajustes
// ---------------------------------------------------------------------------

export const AJUSTES: readonly Ajuste[] = [
  { clave: 'moneda', valor: 'GTQ' },
  { clave: 'locale', valor: 'es-GT' },
  { clave: 'zona_entrega', valor: 'Chiquimula' },
  { clave: 'whatsapp', valor: '50245827110' },
  { clave: 'envio_domicilio', valor: '7' },
  { clave: 'vaso_bebida', valor: '16 oz' },
];

// ---------------------------------------------------------------------------

/** El catalogo completo tal como lo devolvera el backend. */
export const CATALOGO: Catalogo = {
  categorias: CATEGORIAS,
  productos: PRODUCTOS,
  configuradores: CONFIGURADORES,
  grupos: GRUPOS,
  opciones: OPCIONES,
  capas: CAPAS,
  paquetes: PAQUETES,
  ajustes: AJUSTES,
};

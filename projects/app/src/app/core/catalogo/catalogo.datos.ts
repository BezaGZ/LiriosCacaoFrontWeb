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

const BASE_CHOCOFRUTA = 7;
const BASE_PALETA = 8;

/** Ruta de la foto base (chocolate tradicional) de las frutas fotografiadas. */
const fotoFruta = (carpeta: string, archivo: string) =>
  `assets/img/chocos/${carpeta}/${archivo}.png`;

export const PRODUCTOS: readonly Producto[] = [
  // --- Chocofrutas: las ocho de chocofruta.seed.ts -------------------------
  // Solo banano, pina y sandia tienen fotografia en el repositorio. Las demas
  // llevan null hasta que exista el archivo: nada apunta a una ruta vacia.
  { id: 'prod_manzana', categoriaId: 'cat_chocofruta', slug: 'chocomanzana', nombre: 'Chocomanzana',
    descripcion: 'Manzana cubierta de chocolate', precio: BASE_CHOCOFRUTA, imagen: null,
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 1, disponible: true },

  { id: 'prod_fresa', categoriaId: 'cat_chocofruta', slug: 'chocofresa', nombre: 'Chocofresa',
    descripcion: 'Fresa cubierta de chocolate', precio: BASE_CHOCOFRUTA, imagen: null,
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 2, disponible: true },

  { id: 'prod_pina', categoriaId: 'cat_chocofruta', slug: 'chocopina', nombre: 'Chocopiña',
    descripcion: 'Piña fresca cubierta de chocolate', precio: BASE_CHOCOFRUTA,
    imagen: fotoFruta('pina', 'chocopinatradicional'),
    configuradorId: 'cfg_chocofruta', sello: 'Más pedido', destacado: true, orden: 3, disponible: true },

  { id: 'prod_melon', categoriaId: 'cat_chocofruta', slug: 'chocomelon', nombre: 'Chocomelón',
    descripcion: 'Melón cubierto de chocolate', precio: BASE_CHOCOFRUTA, imagen: null,
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 4, disponible: true },

  { id: 'prod_melocoton', categoriaId: 'cat_chocofruta', slug: 'chocomelocoton', nombre: 'Chocomelocotón',
    descripcion: 'Melocotón cubierto de chocolate', precio: BASE_CHOCOFRUTA, imagen: null,
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 5, disponible: true },

  { id: 'prod_banano', categoriaId: 'cat_chocofruta', slug: 'chocobanano', nombre: 'Chocobanano',
    descripcion: 'Banano cubierto de chocolate', precio: BASE_CHOCOFRUTA,
    imagen: fotoFruta('banano', 'chocobananotradicional'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: true, orden: 6, disponible: true },

  { id: 'prod_sandia', categoriaId: 'cat_chocofruta', slug: 'chocosandia', nombre: 'Chocosandía',
    descripcion: 'Sandía cubierta de chocolate', precio: BASE_CHOCOFRUTA,
    imagen: fotoFruta('sandia', 'chocosandiatradicional'),
    configuradorId: 'cfg_chocofruta', sello: '', destacado: true, orden: 7, disponible: true },

  { id: 'prod_uva', categoriaId: 'cat_chocofruta', slug: 'chocouva', nombre: 'Chocouva',
    descripcion: 'Uvas cubiertas de chocolate', precio: BASE_CHOCOFRUTA, imagen: null,
    configuradorId: 'cfg_chocofruta', sello: '', destacado: false, orden: 8, disponible: true },

  // --- Paletas: doce ------------------------------------------------------
  // Las ocho propias mas los cuatro sabores de quetzalteca, que antes vivian
  // apretados en un solo producto y el cliente no podia pedir uno solo.
  { id: 'prod_pal_vino', categoriaId: 'cat_helado', slug: 'paleta-vino', nombre: 'Paleta de vino',
    descripcion: 'Paleta de crema sabor vino', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 1, disponible: true },

  { id: 'prod_pal_tamarindo', categoriaId: 'cat_helado', slug: 'paleta-tamarindo', nombre: 'Paleta de tamarindo',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 2, disponible: true },

  { id: 'prod_pal_jamaica', categoriaId: 'cat_helado', slug: 'paleta-jamaica', nombre: 'Paleta de jamaica',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 3, disponible: true },

  { id: 'prod_pal_mora', categoriaId: 'cat_helado', slug: 'paleta-mora', nombre: 'Paleta de mora',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 4, disponible: true },

  { id: 'prod_pal_naranja', categoriaId: 'cat_helado', slug: 'paleta-naranja', nombre: 'Paleta de naranja',
    descripcion: 'Sabores de quetzalteca', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 5, disponible: true },

  { id: 'prod_pal_melocoton', categoriaId: 'cat_helado', slug: 'paleta-melocoton', nombre: 'Paleta de melocotón',
    descripcion: 'Paleta de crema sabor melocotón', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 6, disponible: true },

  { id: 'prod_pal_coctel', categoriaId: 'cat_helado', slug: 'paleta-coctel-frutas', nombre: 'Coctel de frutas',
    descripcion: 'Paleta con trozos de fruta', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 7, disponible: true },

  { id: 'prod_pal_oreo', categoriaId: 'cat_helado', slug: 'paleta-oreo', nombre: 'Paleta de oreo',
    descripcion: 'Paleta de crema con galleta oreo', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 8, disponible: true },

  { id: 'prod_pal_cafe', categoriaId: 'cat_helado', slug: 'paleta-cafe-espreso', nombre: 'Paleta de café espreso',
    descripcion: 'Paleta de crema sabor café', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 9, disponible: true },

  { id: 'prod_pal_chocolate', categoriaId: 'cat_helado', slug: 'paleta-chocolate', nombre: 'Paleta de chocolate',
    descripcion: 'Paleta de crema de chocolate', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 10, disponible: true },

  { id: 'prod_pal_pina_colada', categoriaId: 'cat_helado', slug: 'paleta-pina-colada', nombre: 'Piña colada',
    descripcion: 'Paleta de piña con coco', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 11, disponible: true },

  { id: 'prod_pal_mania', categoriaId: 'cat_helado', slug: 'paleta-mania', nombre: 'Paleta de manía',
    descripcion: 'Paleta de crema con manía', precio: BASE_PALETA, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 12, disponible: true },

  // --- Bebidas: ocho cafes frios, vaso de 16 oz ---------------------------
  // Un solo tamano, asi que no llevan configurador: se agregan directo.
  // Sin precio todavia: por eso van en null y como no disponibles.
  { id: 'prod_beb_vanilla', categoriaId: 'cat_bebida', slug: 'vanilla-cloud', nombre: 'Vanilla Cloud',
    descripcion: 'Suave · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 1, disponible: false },

  { id: 'prod_beb_caramel', categoriaId: 'cat_bebida', slug: 'caramel-kiss', nombre: 'Caramel Kiss',
    descripcion: 'Dulce · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 2, disponible: false },

  { id: 'prod_beb_chocomood', categoriaId: 'cat_bebida', slug: 'chocolate-mood', nombre: 'Chocolate Mood',
    descripcion: 'Chocolatoso · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 3, disponible: false },

  { id: 'prod_beb_blackvelvet', categoriaId: 'cat_bebida', slug: 'black-velvet', nombre: 'Black Velvet',
    descripcion: 'Intenso · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 4, disponible: false },

  { id: 'prod_beb_whiteromance', categoriaId: 'cat_bebida', slug: 'white-romance', nombre: 'White Romance',
    descripcion: 'Cremoso · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 5, disponible: false },

  { id: 'prod_beb_hazelnut', categoriaId: 'cat_bebida', slug: 'hazelnut-dream', nombre: 'Hazelnut Dream',
    descripcion: 'Tostado · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 6, disponible: false },

  { id: 'prod_beb_tentacion', categoriaId: 'cat_bebida', slug: 'dulce-tentacion', nombre: 'Dulce Tentación',
    descripcion: 'Acaramelado · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 7, disponible: false },

  { id: 'prod_beb_pinkaffair', categoriaId: 'cat_bebida', slug: 'pink-affair', nombre: 'Pink Affair',
    descripcion: 'Frutal · 16 oz', precio: null, imagen: null,
    configuradorId: null, sello: '', destacado: false, orden: 8, disponible: false },
];

// ---------------------------------------------------------------------------
// Hoja: configuradores
// ---------------------------------------------------------------------------

export const CONFIGURADORES: readonly Configurador[] = [
  { id: 'cfg_chocofruta', nombre: 'Armado de chocofruta' },
];

// ---------------------------------------------------------------------------
// Hoja: grupos
// ---------------------------------------------------------------------------

export const GRUPOS: readonly Grupo[] = [
  // El chocolate NO lleva incluidas: el tradicional cuesta 0 y los de color
  // cuestan 1 cada uno. Eso ya lo dice el precioExtra de cada opcion.
  { id: 'grp_chocolate', configuradorId: 'cfg_chocofruta', nombre: 'Chocolate',
    ayuda: 'elija uno', tipo: 'uno', obligatorio: true, incluidas: 0, maximo: null,
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
];

// ---------------------------------------------------------------------------
// Hoja: opciones
// ---------------------------------------------------------------------------

const EXTRA_TOPPING = 2;
const EXTRA_CHOCOLATE_COLOR = 1;

export const OPCIONES: readonly Opcion[] = [
  // --- Chocolates ---------------------------------------------------------
  { id: 'opt_choco_guinda', grupoId: 'grp_chocolate', slug: 'guinda', nombre: 'Guinda',
    precioExtra: EXTRA_CHOCOLATE_COLOR, color: '#e4849f', imagen: null, abreGrupoId: null, orden: 1, disponible: true },
  { id: 'opt_choco_chicle', grupoId: 'grp_chocolate', slug: 'chicle', nombre: 'Chicle',
    precioExtra: EXTRA_CHOCOLATE_COLOR, color: '#9ecfe8', imagen: null, abreGrupoId: null, orden: 2, disponible: true },
  { id: 'opt_choco_caramelo', grupoId: 'grp_chocolate', slug: 'caramelo', nombre: 'Caramelo',
    precioExtra: EXTRA_CHOCOLATE_COLOR, color: '#d9b38c', imagen: null, abreGrupoId: null, orden: 3, disponible: true },
  { id: 'opt_choco_tradicional', grupoId: 'grp_chocolate', slug: 'tradicional', nombre: 'Tradicional',
    precioExtra: 0, color: '#6b4226', imagen: null, abreGrupoId: null, orden: 4, disponible: true },
  { id: 'opt_choco_blanco', grupoId: 'grp_chocolate', slug: 'blanco', nombre: 'Blanco',
    precioExtra: EXTRA_CHOCOLATE_COLOR, color: '#f5ede2', imagen: null, abreGrupoId: null, orden: 5, disponible: true },

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
  { id: 'paq_ocho', slug: 'paquete-de-8', nombre: 'Paquete de 8',
    descripcion: '8 chocofrutas a elegir, en empaque premium',
    categoriaId: 'cat_chocofruta', cantidad: 8, desde: false, gratis: 0,
    empaque: 'premium', precio: null, sello: '', orden: 1, disponible: true },

  { id: 'paq_fiesta', slug: 'paquete-fiesta', nombre: 'Paquete fiesta',
    descripcion: 'Desde 15 chocofrutas y la siguiente va gratis',
    categoriaId: 'cat_chocofruta', cantidad: 15, desde: true, gratis: 1,
    empaque: '', precio: null, sello: '+1 gratis', orden: 2, disponible: true },
];

// ---------------------------------------------------------------------------
// Hoja: ajustes
// ---------------------------------------------------------------------------

export const AJUSTES: readonly Ajuste[] = [
  { clave: 'moneda', valor: 'GTQ' },
  { clave: 'locale', valor: 'es-GT' },
  { clave: 'zona_entrega', valor: 'Chiquimula' },
  { clave: 'whatsapp', valor: '[NUMERO]' },
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

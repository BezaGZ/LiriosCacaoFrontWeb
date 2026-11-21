/**
 * El catalogo como TABLAS PLANAS.
 *
 * Cada interfaz de este archivo es una tabla: una hoja de Excel, una tabla de
 * base de datos o un arreglo JSON que devuelve un backend. Son la misma cosa
 * escrita de tres formas.
 *
 * Por eso aqui no hay objetos anidados ni referencias por valor: una fruta no
 * "contiene" sus chocolates, los apunta por id. Un objeto anidado no cabe en
 * una celda; un id si. Esa es toda la razon de la forma de este archivo, y es
 * lo que hace que migrar a backend o a hoja de calculo sea copiar, no
 * reescribir.
 *
 * Reglas que no se rompen:
 *   1. Todo registro tiene un `id` estable. Nunca se reusa ni se renumera.
 *   2. Las relaciones van por id (`categoriaId`, `grupoId`), jamas anidadas.
 *   3. Todo campo es un escalar: texto, numero, booleano o null.
 *   4. `null` significa "todavia no definido", no cero.
 *   5. El orden lo manda la columna `orden`, nunca la posicion en el arreglo.
 */

/** Identificador estable. Texto y no numero: sobrevive a fusiones de datos. */
export type Id = string;

/** Ruta de imagen relativa a assets, o null si todavia no hay fotografia. */
export type RutaImagen = string | null;

/** Precio en quetzales. null = sin definir todavia (celda vacia en la hoja). */
export type Precio = number | null;

// ---------------------------------------------------------------------------
// Hoja: categorias
// ---------------------------------------------------------------------------

/**
 * Las secciones del catalogo. Existen como tabla y no como union de textos
 * para que agregar "Comida" sea una fila y no un cambio de codigo.
 */
export interface Categoria {
  readonly id: Id;
  readonly slug: string;
  readonly nombre: string;
  /** Nombre del icono que dibuja la interfaz. Texto, no el dibujo. */
  readonly icono: string;
  readonly orden: number;
  readonly disponible: boolean;
}

// ---------------------------------------------------------------------------
// Hoja: productos
// ---------------------------------------------------------------------------

/**
 * TODO lo que se puede pedir, en una sola lista: chocofrutas, paletas y cafes.
 *
 * Hoy el codigo tiene tres arreglos con tres formas distintas, y la rejilla
 * del catalogo tiene que fusionarlos a mano cada vez. Con una sola tabla la
 * rejilla es un filtro por `categoriaId` y se acabo.
 *
 * Lo que distingue a una chocofruta de un cafe no es su tipo: es que la
 * chocofruta apunta a un configurador y el cafe no.
 */
export interface Producto {
  readonly id: Id;
  readonly categoriaId: Id;
  readonly slug: string;
  readonly nombre: string;
  /** Lo que lleva, en una linea. Es lo que se lee bajo el nombre. */
  readonly descripcion: string;
  /** Precio base. Los extras del configurador se suman encima. */
  readonly precio: Precio;
  readonly imagen: RutaImagen;
  /** null = se agrega al carrito directo. Con valor = abre configurador. */
  readonly configuradorId: Id | null;
  /** Texto corto sobre la foto: "Mas pedido", "Nuevo". Vacio = sin sello. */
  readonly sello: string;
  /** Si aparece en la fila de destacados del inicio. */
  readonly destacado: boolean;
  readonly orden: number;
  readonly disponible: boolean;
}

// ---------------------------------------------------------------------------
// Hoja: configuradores
// ---------------------------------------------------------------------------

/**
 * Un configurador es un juego de grupos de opciones con nombre.
 *
 * Existe para que las ocho chocofrutas compartan un solo configurador en vez
 * de repetir chocolates y toppings ocho veces. Agregar la novena fruta es una
 * fila en `productos` que apunta aqui.
 */
export interface Configurador {
  readonly id: Id;
  readonly nombre: string;
}

// ---------------------------------------------------------------------------
// Hoja: grupos
// ---------------------------------------------------------------------------

/** 'uno' = se elige una sola opcion. 'varios' = se pueden marcar varias. */
export type TipoGrupo = 'uno' | 'varios';

/**
 * Un bloque de opciones dentro de un configurador: "Chocolate", "Toppings".
 *
 * `incluidas` es lo que reemplaza la regla `baseConHastaUnTopping` que hoy
 * esta escrita en codigo: el grupo de toppings incluye 1, y de ahi en adelante
 * cada opcion cobra su `precioExtra`. Subir el incluido a 2 pasa a ser editar
 * una celda.
 */
export interface Grupo {
  readonly id: Id;
  readonly configuradorId: Id;
  readonly nombre: string;
  /** Linea gris bajo el titulo: "el primero va incluido". Puede ir vacia. */
  readonly ayuda: string;
  readonly tipo: TipoGrupo;
  readonly obligatorio: boolean;
  /** Cuantas opciones no cobran. El resto suma su precioExtra. */
  readonly incluidas: number;
  /** Tope de opciones marcadas. null = sin tope. Solo aplica a 'varios'. */
  readonly maximo: number | null;
  /**
   * Si tiene valor, este grupo MUESTRA las opciones de otro grupo sin cobrar
   * nada. Es como se elige el color de las lineas de chocolate sin repetir
   * los cinco chocolates en otras cinco filas: si manana entra un sexto
   * chocolate, entra una sola vez.
   */
  readonly tomaOpcionesDe: Id | null;
  /**
   * false = no se dibuja suelto; aparece solo cuando una opcion lo abre.
   * Asi funcionan "Color de las lineas" y "Color del segundo bano".
   */
  readonly visible: boolean;
  readonly orden: number;
}

// ---------------------------------------------------------------------------
// Hoja: opciones
// ---------------------------------------------------------------------------

/**
 * Una eleccion concreta: un chocolate, un topping, el doble chocolate.
 *
 * `color` y `abreGrupoId` son lo que permite que la interfaz muestre una
 * muestra de color y que marcar "Lineas de chocolate" despliegue el selector
 * del color de las lineas, todo sin una sola condicion escrita en codigo.
 */
export interface Opcion {
  readonly id: Id;
  readonly grupoId: Id;
  readonly slug: string;
  readonly nombre: string;
  /** Lo que suma si se elige y ya se gastaron las `incluidas` del grupo. */
  readonly precioExtra: number;
  /** Hexadecimal para la muestra de color, o null si la opcion no es color. */
  readonly color: string | null;
  /** Capa que se encima a la foto del producto, si existe. */
  readonly imagen: RutaImagen;
  /** Al elegirla se abre este grupo. null = no abre nada. */
  readonly abreGrupoId: Id | null;
  readonly orden: number;
  readonly disponible: boolean;
}

// ---------------------------------------------------------------------------
// Hoja: capas
// ---------------------------------------------------------------------------

/** 'base' reemplaza la foto del producto. 'encima' se dibuja sobre ella. */
export type TipoCapa = 'base' | 'encima';

/**
 * La fotografia de UNA combinacion concreta: esta fruta con este chocolate,
 * esta fruta con este topping.
 *
 * Es una tabla aparte y no un campo de `Opcion` porque la foto depende de las
 * dos cosas a la vez: los angelitos sobre piña no son los angelitos sobre
 * banano. Tenerla asi tiene una ventaja que importa mas de lo que parece: una
 * combinacion sin fila simplemente muestra la foto base del producto, asi que
 * el catalogo nunca queda roto por una foto que no se ha tomado, y completar
 * una fruta es agregar filas.
 */
export interface Capa {
  readonly productoId: Id;
  readonly opcionId: Id;
  readonly tipo: TipoCapa;
  readonly imagen: string;
}

// ---------------------------------------------------------------------------
// Hoja: paquetes
// ---------------------------------------------------------------------------

/**
 * Un paquete se vende por cantidad, no por unidad, y por eso no cabe en
 * `productos`: su precio no sale de multiplicar.
 *
 * `cantidad` es el minimo que lleva y `gratis` lo que se regala encima: el
 * paquete de fiesta es cantidad 15 y gratis 1.
 */
export interface Paquete {
  readonly id: Id;
  readonly slug: string;
  readonly nombre: string;
  readonly descripcion: string;
  /** De que categoria se arma el paquete. */
  readonly categoriaId: Id;
  /** Unidades que lleva el paquete, o el minimo si `desde` es true. */
  readonly cantidad: number;
  /** true = "desde 15". false = exactamente esa cantidad. */
  readonly desde: boolean;
  /** Unidades de regalo encima de `cantidad`. 0 = ninguna. */
  readonly gratis: number;
  /** Como se entrega: "premium", "caja", "bolsa". Vacio = sin empaque especial. */
  readonly empaque: string;
  readonly precio: Precio;
  readonly sello: string;
  readonly orden: number;
  readonly disponible: boolean;
}

// ---------------------------------------------------------------------------
// Hoja: ajustes
// ---------------------------------------------------------------------------

/**
 * Los numeros y textos sueltos del negocio, como pares clave-valor.
 *
 * Es una hoja de dos columnas a proposito: cambiar el numero de WhatsApp o la
 * zona de entrega no deberia ser un despliegue.
 */
export interface Ajuste {
  readonly clave: string;
  readonly valor: string;
}

// ---------------------------------------------------------------------------
// El catalogo completo
// ---------------------------------------------------------------------------

/**
 * Las ocho tablas juntas. Esto es exactamente lo que devolvera el backend y
 * exactamente lo que exporta el Excel: ocho arreglos de objetos planos.
 */
export interface Catalogo {
  readonly categorias: readonly Categoria[];
  readonly productos: readonly Producto[];
  readonly configuradores: readonly Configurador[];
  readonly grupos: readonly Grupo[];
  readonly opciones: readonly Opcion[];
  readonly capas: readonly Capa[];
  readonly paquetes: readonly Paquete[];
  readonly ajustes: readonly Ajuste[];
}

// ---------------------------------------------------------------------------
// Lo que el cliente arma
// ---------------------------------------------------------------------------

/**
 * Una eleccion del cliente dentro del configurador.
 *
 * Guarda ids y no objetos: asi una linea del carrito se puede serializar a
 * localStorage hoy y mandar a un backend manana sin tocarla.
 */
export interface Eleccion {
  readonly grupoId: Id;
  readonly opcionId: Id;
}

/** Una linea del pedido. */
export interface LineaPedido {
  readonly productoId: Id;
  readonly elecciones: readonly Eleccion[];
  readonly cantidad: number;
}

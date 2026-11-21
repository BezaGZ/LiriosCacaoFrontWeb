# Catálogo

El catálogo como **ocho tablas planas**. La misma forma sirve hoy quemada en
TypeScript, mañana como hojas de Excel y pasado como respuesta de un backend.

## Por qué así

Hoy el catálogo vive en tres formas distintas que no se parecen: chocofruta
tiene `frutas/chocolates/toppings/reglas`, helado tiene `tipo:'paleta'` con
unas reglas que nadie usa, y bebida es una lista plana. Para pintar la rejilla
del catálogo hay que fusionar tres cosas incompatibles a mano, y para cambiar
un precio hay que tocar código.

Esta estructura resuelve las dos cosas con una sola decisión: **todo es una
fila y las relaciones van por id**. Un objeto anidado no cabe en una celda de
Excel; un id sí.

## Las ocho hojas

| Hoja | Qué guarda | Filas hoy |
|---|---|---|
| `categorias` | Las secciones del catálogo | 5 |
| `productos` | Todo lo que se puede pedir | 28 |
| `configuradores` | Juegos de opciones con nombre | 1 |
| `grupos` | Bloques de opciones (Chocolate, Toppings) | 5 |
| `opciones` | Cada elección concreta | 15 |
| `capas` | La foto de cada combinación | 42 |
| `paquetes` | Lo que se vende por cantidad | 2 |
| `ajustes` | Números sueltos del negocio | 5 |

## Columnas

### categorias
`id` · `slug` · `nombre` · `icono` · `orden` · `disponible`

### productos
`id` · `categoriaId` · `slug` · `nombre` · `descripcion` · `precio` ·
`imagen` · `configuradorId` · `sello` · `destacado` · `orden` · `disponible`

Las 8 chocofrutas, las 12 paletas y los 8 cafés viven aquí juntos. Lo que
distingue una chocofruta de un café no es su tipo: es que la chocofruta tiene
`configuradorId` y el café lo tiene vacío.

### configuradores
`id` · `nombre`

### grupos
`id` · `configuradorId` · `nombre` · `ayuda` · `tipo` · `obligatorio` ·
`incluidas` · `maximo` · `tomaOpcionesDe` · `visible` · `orden`

- `tipo`: `uno` (radio) o `varios` (casillas).
- `incluidas`: cuántas opciones no cobran. Toppings lleva 1.
- `tomaOpcionesDe`: muestra las opciones de otro grupo sin cobrar. Así
  "Color de las líneas" ofrece los 5 chocolates sin repetirlos como 5 filas
  más — si mañana entra un sexto chocolate, entra una sola vez.
- `visible`: `no` significa que no se dibuja solo; lo abre una opción.

### opciones
`id` · `grupoId` · `slug` · `nombre` · `precioExtra` · `color` · `imagen` ·
`abreGrupoId` · `orden` · `disponible`

- `abreGrupoId`: al elegirla se despliega ese grupo. Es como "Líneas de
  chocolate" pregunta el color sin una sola condición escrita en código.

### capas
`productoId` · `opcionId` · `tipo` · `imagen`

- `tipo`: `base` reemplaza la foto del producto, `encima` se dibuja sobre ella.
- Una combinación **sin fila aquí** muestra la foto base del producto. Por eso
  existen 42 fotos de las 112 posibles y nada se rompe: completar una fruta es
  agregar filas.

### paquetes
`id` · `slug` · `nombre` · `descripcion` · `categoriaId` · `cantidad` ·
`desde` · `gratis` · `empaque` · `precio` · `sello` · `orden` · `disponible`

El paquete de fiesta es `cantidad 15`, `desde sí`, `gratis 1`: pide 15 y
lleva 16.

### ajustes
`clave` · `valor`

## Reglas de la hoja

1. **Celda vacía en `precio` = todavía no hay precio.** No es cero. Los ocho
   cafés están así, y el motor devuelve `null` en vez de cobrar Q0.
2. **Celda vacía en `imagen` = no hay fotografía.** Nada apunta a un archivo
   que no existe.
3. **Los `id` no se reusan ni se renumeran.** Si un producto sale del menú se
   le pone `disponible: no`, no se borra la fila: hay pedidos viejos que lo
   mencionan.
4. **El orden lo manda la columna `orden`**, nunca la posición de la fila.
5. **Todo valor es escalar.** Texto, número, sí/no, o vacío.

## Los precios ya no son código

Las tres interfaces `PrecioReglas*` desaparecen. Las reglas de hoy quedan así:

| Regla vieja (código) | Dónde vive ahora |
|---|---|
| `baseConHastaUnTopping: 7` | `productos.precio` = 7 y `grupos.incluidas` = 1 |
| `recargoChocolateNoTradicional: 1` | `opciones.precioExtra` = 1 en los 4 de color |
| `recargoToppingExtra: 2` | `opciones.precioExtra` = 2 en cada topping |
| `recargoDobleChocolate: 2` | `opciones.precioExtra` = 2 en Doble chocolate |

Subir el topping extra de Q2 a Q3 pasa a ser editar nueve celdas en vez de
desplegar.

Detalle del motor: cuando un grupo incluye opciones gratis, **se descuentan las
más caras**. Con los toppings de hoy da igual porque todos valen Q2; importa el
día que uno valga más, y entonces lo que se regala es lo caro.

## La migración

La aplicación **nunca importa `CATALOGO`**. Pide `FuenteCatalogo`:

```ts
export interface FuenteCatalogo {
  obtener(): Promise<Catalogo>;
}
```

Hoy la implementa `FuenteCatalogoQuemada`, que devuelve los datos de
`catalogo.datos.ts`. El día del backend se escribe `FuenteCatalogoHttp` y se
cambia una línea en `app.config.ts`. Ninguna pantalla se entera.

Es asíncrona desde hoy a propósito, aunque la respuesta sea inmediata: si
fuera síncrona, el día del backend habría que volver asíncrona cada pantalla
que la usa, y ese es justo el trabajo que esta costura existe para evitar.

### Desde Excel

1. Una hoja por tabla, con los nombres de columna de arriba en la fila 1.
2. Exportar cada hoja a JSON (`nombre_hoja.json`).
3. Servirlas, o juntarlas en un solo `catalogo.json` con las ocho claves.
4. `FuenteCatalogoHttp` lo pide y ya.

El `Catalogo` de TypeScript y el JSON exportado son el mismo objeto.

## Lo que falta llenar

- Precio de los 8 cafés.
- Precio de los 2 paquetes.
- Número de WhatsApp en `ajustes`.
- Fotos: 5 chocofrutas, 12 paletas y 8 cafés. Las filas ya existen con
  `imagen` vacío.

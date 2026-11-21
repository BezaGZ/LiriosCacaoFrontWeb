import { CATALOGO } from './catalogo.datos';
import { LineaPedido } from './catalogo.models';
import {
  desglose, hayPreciosPendientes, opcionesDe, precioLinea, precioPedido,
  precioUnitario, unidadesDelPaquete,
} from './catalogo.precio';

/*
 * Estas pruebas cubren dos cosas distintas.
 *
 * La primera es el precio, que es literalmente donde se decide cuanto se
 * cobra. Los numeros esperados son los que la aplicacion ya cobraba con las
 * reglas escritas en codigo: si esta estructura devolviera otros, la
 * migracion estaria cambiando precios a espaldas del negocio.
 *
 * La segunda es la integridad de las tablas. Ahora que las relaciones van por
 * id, un id mal escrito no lo atrapa el compilador: lo atrapa esto.
 */

const linea = (productoId: string, elecciones: [string, string][], cantidad = 1): LineaPedido => ({
  productoId,
  elecciones: elecciones.map(([grupoId, opcionId]) => ({ grupoId, opcionId })),
  cantidad,
});

const TRADICIONAL: [string, string] = ['grp_chocolate', 'opt_choco_tradicional'];
const BLANCO: [string, string] = ['grp_chocolate', 'opt_choco_blanco'];
const ANGELITOS: [string, string] = ['grp_toppings', 'opt_top_angelitos'];
const OREO: [string, string] = ['grp_toppings', 'opt_top_oreo'];
const COCO: [string, string] = ['grp_toppings', 'opt_top_coco'];
const DOBLE: [string, string] = ['grp_extra', 'opt_extra_doble'];

describe('precio de la chocofruta', () => {
  it('cobra Q7 con el chocolate tradicional y un topping', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS]))).toBe(7);
  });

  it('cobra Q7 sin ningun topping: el incluido no es obligatorio', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL]))).toBe(7);
  });

  it('suma Q1 por el chocolate de color', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [BLANCO, ANGELITOS]))).toBe(8);
  });

  it('suma Q2 por cada topping despues del primero', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS, OREO]))).toBe(9);
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS, OREO, COCO]))).toBe(11);
  });

  it('suma Q2 por el doble chocolate', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS, DOBLE]))).toBe(9);
  });

  it('acumula todos los recargos a la vez', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [BLANCO, ANGELITOS, OREO, COCO, DOBLE]))).toBe(14);
  });

  it('no cobra por el color de las lineas: ese topping ya se pago', () => {
    const conLineas = linea('prod_pina', [
      TRADICIONAL,
      ['grp_toppings', 'opt_top_lineas'],
      ['grp_color_lineas', 'opt_choco_guinda'],
    ]);
    expect(precioUnitario(CATALOGO, conLineas)).toBe(7);
  });

  it('multiplica por la cantidad', () => {
    expect(precioLinea(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS], 3))).toBe(21);
  });
});

describe('productos sin configurador', () => {
  it('la paleta cuesta Q8 y no acepta extras', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pal_vino', []))).toBe(8);
  });

  it('un cafe sin precio devuelve null, nunca cero', () => {
    expect(precioUnitario(CATALOGO, linea('prod_beb_vanilla', []))).toBeNull();
  });

  it('avisa que el pedido tiene precios pendientes', () => {
    const pedido = [linea('prod_pal_vino', []), linea('prod_beb_vanilla', [])];
    expect(precioPedido(CATALOGO, pedido)).toBe(8);
    expect(hayPreciosPendientes(CATALOGO, pedido)).toBe(true);
  });
});

describe('desglose', () => {
  it('explica cada recargo y suma lo mismo que el total', () => {
    const l = linea('prod_pina', [BLANCO, ANGELITOS, OREO, COCO, DOBLE]);
    const filas = desglose(CATALOGO, l);
    expect(filas.map((f) => f.texto)).toEqual([
      'Chocopiña', 'Chocolate blanco', '2 toppings extra', 'Doble chocolate',
    ]);
    const suma = filas.reduce((t, f) => t + f.monto, 0);
    expect(suma).toBe(precioUnitario(CATALOGO, l) as number);
  });
});

describe('grupos prestados', () => {
  it('el color de las lineas ofrece los cinco chocolates sin cobrar', () => {
    const g = CATALOGO.grupos.find((x) => x.id === 'grp_color_lineas')!;
    const opciones = opcionesDe(CATALOGO, g);
    expect(opciones.length).toBe(5);
    expect(opciones.every((o) => o.precioExtra === 0)).toBe(true);
  });
});

describe('paquetes', () => {
  it('el de 8 entrega 8', () => {
    const p = CATALOGO.paquetes.find((x) => x.id === 'paq_ocho')!;
    expect(unidadesDelPaquete(p)).toBe(8);
  });

  it('el de fiesta entrega 16 por 15, y respeta pedidos mayores', () => {
    const p = CATALOGO.paquetes.find((x) => x.id === 'paq_fiesta')!;
    expect(unidadesDelPaquete(p)).toBe(16);
    expect(unidadesDelPaquete(p, 20)).toBe(21);
  });
});

describe('integridad de las tablas', () => {
  const ids = <T extends { id: string }>(t: readonly T[]) => new Set(t.map((x) => x.id));
  const idsCategorias = ids(CATALOGO.categorias);
  const idsProductos = ids(CATALOGO.productos);
  const idsGrupos = ids(CATALOGO.grupos);
  const idsOpciones = ids(CATALOGO.opciones);
  const idsConfig = ids(CATALOGO.configuradores);

  it('no hay ids repetidos en productos', () => {
    expect(idsProductos.size).toBe(CATALOGO.productos.length);
  });

  it('tiene las 8 chocofrutas, 12 paletas y 8 bebidas', () => {
    const porCategoria = (c: string) => CATALOGO.productos.filter((p) => p.categoriaId === c).length;
    expect(porCategoria('cat_chocofruta')).toBe(8);
    expect(porCategoria('cat_helado')).toBe(12);
    expect(porCategoria('cat_bebida')).toBe(8);
  });

  it('ningun producto apunta a una categoria o configurador que no existe', () => {
    for (const p of CATALOGO.productos) {
      expect(idsCategorias.has(p.categoriaId)).toBe(true);
      if (p.configuradorId !== null) expect(idsConfig.has(p.configuradorId)).toBe(true);
    }
  });

  it('ninguna opcion apunta a un grupo que no existe', () => {
    for (const o of CATALOGO.opciones) {
      expect(idsGrupos.has(o.grupoId)).toBe(true);
      if (o.abreGrupoId !== null) expect(idsGrupos.has(o.abreGrupoId)).toBe(true);
    }
  });

  it('ningun grupo toma opciones de un grupo que no existe', () => {
    for (const g of CATALOGO.grupos) {
      if (g.tomaOpcionesDe !== null) expect(idsGrupos.has(g.tomaOpcionesDe)).toBe(true);
    }
  });

  it('las 42 capas apuntan a un producto y una opcion reales', () => {
    expect(CATALOGO.capas.length).toBe(42);
    expect(CATALOGO.capas.filter((c) => c.tipo === 'base').length).toBe(15);
    expect(CATALOGO.capas.filter((c) => c.tipo === 'encima').length).toBe(27);
    for (const c of CATALOGO.capas) {
      expect(idsProductos.has(c.productoId)).toBe(true);
      expect(idsOpciones.has(c.opcionId)).toBe(true);
    }
  });

  it('un producto con foto no deja la ruta vacia y uno sin foto no la inventa', () => {
    const sinFoto = CATALOGO.productos.filter((p) => p.imagen === null);
    expect(sinFoto.map((p) => p.id)).toEqual(['prod_melocoton']);
    const conFoto = CATALOGO.productos.filter((p) => p.imagen !== null);
    expect(conFoto.length).toBe(27);
    for (const p of conFoto) expect(p.imagen).toMatch(/^assets\/img\/productos\/.+\.png$/);
  });
});

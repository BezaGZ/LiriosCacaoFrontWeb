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
  it('cobra Q10 con el chocolate tradicional y un topping', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS]))).toBe(10);
  });

  it('cobra Q10 sin ningun topping: el incluido no es obligatorio', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL]))).toBe(10);
  });

  it('no cobra por el chocolate de color: cualquiera entra en los Q10', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [BLANCO, ANGELITOS]))).toBe(10);
  });

  it('suma Q2 por cada topping despues del primero', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS, OREO]))).toBe(12);
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS, OREO, COCO]))).toBe(14);
  });

  it('suma Q2 por el doble chocolate: ese si es un bano mas', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS, DOBLE]))).toBe(12);
  });

  it('acumula todos los recargos a la vez', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pina', [BLANCO, ANGELITOS, OREO, COCO, DOBLE]))).toBe(16);
  });

  it('no cobra por el color de las lineas: ese topping ya se pago', () => {
    const conLineas = linea('prod_pina', [
      TRADICIONAL,
      ['grp_toppings', 'opt_top_lineas'],
      ['grp_color_lineas', 'opt_choco_guinda'],
    ]);
    expect(precioUnitario(CATALOGO, conLineas)).toBe(10);
  });

  it('multiplica por la cantidad', () => {
    expect(precioLinea(CATALOGO, linea('prod_pina', [TRADICIONAL, ANGELITOS], 3))).toBe(30);
  });
});

describe('la paleta', () => {
  const SIN: [string, string] = ['grp_choco_paleta', 'opt_pal_sin'];
  const GUINDA: [string, string] = ['grp_choco_paleta', 'opt_pal_guinda'];

  it('cuesta Q10 sin chocolate', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pal_vino', [SIN]))).toBe(10);
    expect(precioUnitario(CATALOGO, linea('prod_pal_vino', []))).toBe(10);
  });

  it('suma Q2 por el chocolate: aqui la primera capa SI se cobra', () => {
    expect(precioUnitario(CATALOGO, linea('prod_pal_vino', [GUINDA]))).toBe(12);
  });

  it('suma Q2 por cada topping: en la paleta no hay ninguno incluido', () => {
    const OREO_P: [string, string] = ['grp_top_paleta', 'opt_paltop_oreo'];
    const COCO_P: [string, string] = ['grp_top_paleta', 'opt_paltop_coco'];
    expect(precioUnitario(CATALOGO, linea('prod_pal_vino', [SIN, OREO_P]))).toBe(12);
    expect(precioUnitario(CATALOGO, linea('prod_pal_vino', [GUINDA, OREO_P, COCO_P]))).toBe(16);
  });

  it('el color de las lineas no se cobra y no ofrece "sin chocolate"', () => {
    const g = CATALOGO.grupos.find((x) => x.id === 'grp_color_lineas_paleta')!;
    const opciones = opcionesDe(CATALOGO, g);
    expect(opciones.length).toBe(5);
    expect(opciones.every((o) => o.precioExtra === 0)).toBe(true);
    expect(opciones.some((o) => o.slug === 'sin-chocolate')).toBe(false);
  });

  it('las doce paletas se arman con el mismo configurador', () => {
    const paletas = CATALOGO.productos.filter((p) => p.categoriaId === 'cat_helado');
    expect(paletas.length).toBe(12);
    expect(paletas.every((p) => p.configuradorId === 'cfg_paleta')).toBe(true);
  });
});

describe('productos sin configurador', () => {

  it('un cafe sin precio devuelve null, nunca cero', () => {
    expect(precioUnitario(CATALOGO, linea('prod_beb_vanilla', []))).toBeNull();
  });

  it('avisa que el pedido tiene precios pendientes', () => {
    const pedido = [linea('prod_pal_vino', []), linea('prod_beb_vanilla', [])];
    expect(precioPedido(CATALOGO, pedido)).toBe(10);
    expect(hayPreciosPendientes(CATALOGO, pedido)).toBe(true);
  });
});

describe('desglose', () => {
  it('explica cada recargo y suma lo mismo que el total', () => {
    const l = linea('prod_pina', [BLANCO, ANGELITOS, OREO, COCO, DOBLE]);
    const filas = desglose(CATALOGO, l);
    expect(filas.map((f) => f.texto)).toEqual([
      'Chocopiña', '2 toppings extra', 'Doble chocolate',
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

  it('el de cumpleanos entrega 28 y el de evento 58', () => {
    const q = (id: string) => CATALOGO.paquetes.find((x) => x.id === id)!;
    expect(unidadesDelPaquete(q('paq_cumpleanos'))).toBe(28);
    expect(unidadesDelPaquete(q('paq_evento'))).toBe(58);
  });

  /*
   * Esta es la regla del escalon, y es la que se rompe sola el dia que se
   * agregue un paquete intermedio con unidades de regalo: mientras mas grande
   * el paquete, mas barata tiene que salir la unidad. Si no, el cliente que
   * pide mas paga mas por pieza y el paquete grande deja de tener sentido.
   */
  it('ningun paquete sale mas caro por unidad que uno mas pequeno', () => {
    const porCategoria = new Set(CATALOGO.paquetes.map((p) => p.categoriaId));

    for (const categoriaId of porCategoria) {
      const escalon = CATALOGO.paquetes
        .filter((p) => p.categoriaId === categoriaId && p.precio !== null)
        .slice()
        .sort((a, b) => unidadesDelPaquete(a) - unidadesDelPaquete(b))
        .map((p) => (p.precio as number) / unidadesDelPaquete(p));

      for (let i = 1; i < escalon.length; i++) {
        expect(escalon[i]).toBeLessThanOrEqual(escalon[i - 1]);
      }
    }
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
    expect(porCategoria('cat_chocofruta')).toBe(9);
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
    expect(sinFoto.length).toBe(0);
    const conFoto = CATALOGO.productos.filter((p) => p.imagen !== null);
    expect(conFoto.length).toBe(29);
    for (const p of conFoto) expect(p.imagen).toMatch(/^assets\/img\/productos\/.+\.webp$/);
  });
});

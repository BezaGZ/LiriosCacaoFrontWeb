import { tituloChocofruta, tituloHelado, nombreTopping } from './product-title';

/*
 * El titulo tiene que reflejar TODA opcion que cambie el precio. Si no, el
 * carrito muestra dos lineas identicas a distinto precio y parece un error.
 */

const fruta = { nombre: 'Fresa' };
const choc  = { nombre: 'Tradicional' };
const oreo  = { id: 'top_oreo', nombre: 'Galleta oreo' };
const coco  = { id: 'top_coco', nombre: 'Coco rayado' };
const lineas = { id: 'top_lineaschocolate', nombre: 'Líneas de chocolate' };

describe('Titulo de producto', () => {

  it('arma el titulo basico de una chocofruta', () => {
    expect(tituloChocofruta({ fruta, chocolate: choc })).toBe('ChocoFresa con Tradicional');
  });

  it('lista los toppings separados por coma', () => {
    expect(tituloChocofruta({ fruta, chocolate: choc, toppings: [oreo, coco] }))
      .toBe('ChocoFresa con Tradicional + Galleta oreo, Coco rayado');
  });

  it('el doble chocolate SI aparece en el titulo', () => {
    const titulo = tituloChocofruta({ fruta, chocolate: choc, toppings: [oreo], dobleChocolate: true });
    expect(titulo).toContain('doble chocolate');
  });

  it('sin doble chocolate no lo menciona', () => {
    expect(tituloChocofruta({ fruta, chocolate: choc, toppings: [oreo] })).not.toContain('doble');
  });

  it('las lineas de chocolate muestran su sabor', () => {
    const titulo = tituloChocofruta({ fruta, chocolate: choc, toppings: [lineas], lineasChocolateSlug: 'rosa' });
    expect(titulo).toContain('Líneas de chocolate Guinda');
  });

  it('sin sabor elegido, las lineas salen con su nombre normal', () => {
    expect(nombreTopping(lineas)).toBe('Líneas de chocolate');
  });

  it('el helado arma sabor, chocolate y extras', () => {
    const titulo = tituloHelado({
      sabor: { nombre: 'Oreo' }, chocolate: { nombre: 'Tradicional' },
      toppings: [oreo], chocolateExtra: true,
    });
    expect(titulo).toBe('Paleta de Oreo c/Tradicional + Galleta oreo (chocolate extra)');
  });

  it('el helado sin chocolate no lo menciona', () => {
    expect(tituloHelado({ sabor: { nombre: 'Vino' } })).toBe('Paleta de Vino');
  });
});

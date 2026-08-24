import { CartService } from './cart.service';
import { NewCartItem } from './cart.models';
import { ProductData } from '@core/ui-models/product-data';

/*
 * El carrito se rompio una vez de forma cara: fusionaba por titulo, y como el
 * titulo no incluia los extras, una chocofruta con doble chocolate se fusionaba
 * con la version sin extra y se cobraba el precio de la primera.
 *
 * Estas pruebas fijan ese comportamiento para que no vuelva.
 */

const fruta  = { id: 'fru_fresa', nombre: 'Fresa', slug: 'fresa', disponible: true } as any;
const choc   = { id: 'choc_tradicional', nombre: 'Tradicional', colorSlug: 'cafe', color: 'cafe', esTradicional: true, disponible: true } as any;
const oreo   = { id: 'top_oreo', nombre: 'Galleta oreo', disponible: true } as any;
const coco   = { id: 'top_coco', nombre: 'Coco rayado', disponible: true } as any;

function chocofruta(precio: number, toppings: any[], dobleChocolate = false): NewCartItem {
  const data: ProductData = {
    chocofruta: { fruta, chocolate: choc, toppings, dobleChocolate, lineasChocolateSlug: null },
  };
  return { kind: 'chocofruta', title: 'ChocoFresa', qty: 1, unitPrice: precio, imageUrls: { base: 'x' }, data };
}

function flor(nombre: string, precio: number): NewCartItem {
  return { kind: 'flor', title: nombre, qty: 1, unitPrice: precio, imageUrls: { base: 'y' }, data: {} };
}

describe('CartService', () => {
  let cart: CartService;

  // 'server' evita que el constructor lea localStorage: cada prueba arranca limpia.
  beforeEach(() => { cart = new CartService('server'); });

  it('empieza vacio', () => {
    expect(cart.items.length).toBe(0);
    expect(cart.count).toBe(0);
    expect(cart.total).toBe(0);
  });

  it('dos productos IDENTICOS se fusionan en una linea', () => {
    cart.add(chocofruta(7, [oreo]));
    cart.add(chocofruta(7, [oreo]));

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].qty).toBe(2);
    expect(cart.total).toBe(14);
  });

  it('el doble chocolate NO se fusiona con la version sin extra', () => {
    cart.add(chocofruta(7, [oreo], false));
    cart.add(chocofruta(9, [oreo], true));

    expect(cart.items.length).toBe(2);
    expect(cart.total).toBe(16);   // el bug viejo daba 14
  });

  it('los mismos toppings en distinto orden si se fusionan', () => {
    cart.add(chocofruta(9, [oreo, coco]));
    cart.add(chocofruta(9, [coco, oreo]));

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].qty).toBe(2);
  });

  it('productos con distinto precio nunca se fusionan', () => {
    cart.add(chocofruta(7, [oreo]));
    cart.add(chocofruta(8, [oreo]));
    expect(cart.items.length).toBe(2);
  });

  it('las flores se distinguen por nombre', () => {
    cart.add(flor('Cajita rosal', 200));
    cart.add(flor('Cajita rosal', 200));
    cart.add(flor('Cajita fresita', 150));

    expect(cart.items.length).toBe(2);
    expect(cart.total).toBe(200 * 2 + 150);
  });

  it('inc y dec cambian la cantidad', () => {
    cart.add(chocofruta(7, [oreo]));
    const id = cart.items[0].id;

    cart.inc(id);
    expect(cart.items[0].qty).toBe(2);

    cart.dec(id);
    expect(cart.items[0].qty).toBe(1);
  });

  it('bajar de 1 elimina la linea en vez de dejarla en cero', () => {
    cart.add(chocofruta(7, [oreo]));
    cart.dec(cart.items[0].id);

    expect(cart.items.length).toBe(0);
  });

  it('remove y clear vacian el carrito', () => {
    cart.add(chocofruta(7, [oreo]));
    cart.add(flor('Cajita rosal', 200));

    cart.remove(cart.items[0].id);
    expect(cart.items.length).toBe(1);

    cart.clear();
    expect(cart.items.length).toBe(0);
  });

  it('un id que no existe no rompe nada', () => {
    cart.add(chocofruta(7, [oreo]));
    cart.inc('no-existe');
    cart.dec('no-existe');
    cart.remove('no-existe');

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].qty).toBe(1);
  });

  it('el total suma precio por cantidad de todas las lineas', () => {
    cart.add(chocofruta(7, [oreo]));
    cart.inc(cart.items[0].id);
    cart.add(flor('Cajita rosal', 200));

    expect(cart.count).toBe(3);
    expect(cart.total).toBe(7 * 2 + 200);
  });
});

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartItem, NewCartItem, buildConfigKey } from '@features/cart/cart.models';
import { leerCarrito, guardarCarrito } from '@features/cart/cart.storage';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this._items$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // En el servidor el carrito siempre arranca vacio: no hay localStorage y
    // el HTML prerenderizado es el mismo para todo el mundo.
    if (isPlatformBrowser(this.platformId)) {
      const guardado = leerCarrito();
      if (guardado.length) {
        this._items$.next(guardado);
      }
    }
  }

  get items(): CartItem[] { return this._items$.value; }
  get count(): number { return this.items.reduce((a, i) => a + i.qty, 0); }
  get total(): number { return this.items.reduce((a, i) => a + i.unitPrice * i.qty, 0); }

  /**
   * Agrega un producto al carrito.
   *
   * Solo se fusiona con un item existente si la configuracion es identica
   * (misma fruta/sabor, mismo chocolate, mismos toppings, mismos extras y
   * mismo precio). Antes se comparaba por titulo, y como el titulo no incluye
   * los extras, "doble chocolate" se fusionaba con la version sin extra y se
   * cobraba el precio equivocado.
   */
  add(item: NewCartItem) {
    const configKey = buildConfigKey(item);
    const idx = this.items.findIndex(i => i.configKey === configKey);
    let next: CartItem[];

    if (idx >= 0) {
      const existing = this.items[idx];
      next = [...this.items];
      next[idx] = { ...existing, qty: existing.qty + item.qty };
    } else {
      next = [...this.items, { ...item, id: this.newId(), configKey }];
    }

    this.publicar(next);
  }

  inc(id: string) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const next = [...this.items];
    next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
    this.publicar(next);
  }

  dec(id: string) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const cur = this.items[idx];
    if (cur.qty <= 1) return this.remove(id);
    const next = [...this.items];
    next[idx] = { ...cur, qty: cur.qty - 1 };
    this.publicar(next);
  }

  remove(id: string) {
    this.publicar(this.items.filter(i => i.id !== id));
  }

  clear() { this.publicar([]); }

  /**
   * Unico punto por donde cambia el carrito, para que guardar no se olvide
   * al agregar un metodo nuevo.
   */
  private publicar(items: CartItem[]): void {
    this._items$.next(items);
    guardarCarrito(items);
  }

  private newId(): string {
    return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, NewCartItem, buildConfigKey } from '@features/cart/cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this._items$.asObservable();

  get items(): CartItem[] { return this._items$.value; }
  get count(): number { return this.items.reduce((a, i) => a + i.qty, 0); }
  get total(): number { return this.items.reduce((a, i) => a + i.unitPrice * i.qty, 0); }

  /**
   * Agrega un producto al carrito.
   *
   * Solo se fusiona con un item existente si la configuración es idéntica
   * (misma fruta/sabor, mismo chocolate, mismos toppings, mismos extras y
   * mismo precio). Antes se comparaba por título, y como el título no incluye
   * los extras, "doble chocolate" se fusionaba con la versión sin extra y se
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

    this._items$.next(next);
  }

  inc(id: string) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const next = [...this.items];
    next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
    this._items$.next(next);
  }

  dec(id: string) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const cur = this.items[idx];
    if (cur.qty <= 1) return this.remove(id);
    const next = [...this.items];
    next[idx] = { ...cur, qty: cur.qty - 1 };
    this._items$.next(next);
  }

  remove(id: string) {
    this._items$.next(this.items.filter(i => i.id !== id));
  }

  clear() { this._items$.next([]); }

  private newId(): string {
    return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  }
}

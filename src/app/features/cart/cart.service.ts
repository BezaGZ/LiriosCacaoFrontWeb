import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>([]);
  private _sidebarVisible$ = new BehaviorSubject<boolean>(false);

  readonly items$ = this._items$.asObservable();
  readonly sidebarVisible$ = this._sidebarVisible$.asObservable();

  get items(): CartItem[] { return this._items$.value; }
  get count(): number { return this.items.reduce((a, i) => a + i.qty, 0); }
  get total(): number { return this.items.reduce((a, i) => a + i.unitPrice * i.qty, 0); }

  open()  { this._sidebarVisible$.next(true); }
  close() { this._sidebarVisible$.next(false); }
  toggle(){ this._sidebarVisible$.next(!this._sidebarVisible$.value); }

  add(item: Omit<CartItem, 'id'>) {
    const key = item.title;
    const idx = this.items.findIndex(i => i.title === key);
    let next: CartItem[];
    if (idx >= 0) {
      const existing = this.items[idx];
      next = [...this.items];
      next[idx] = { ...existing, qty: existing.qty + item.qty };
    } else {
      const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
      next = [...this.items, { ...item, id }];
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
}

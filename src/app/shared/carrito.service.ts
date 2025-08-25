import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private _count$ = new BehaviorSubject<number>(0);
  readonly count$ = this._count$.asObservable();

  setCount(n: number) { this._count$.next(Math.max(0, n)); }
  increment(by = 1) { this._count$.next(this._count$.value + by); }
  clear() { this._count$.next(0); }
}

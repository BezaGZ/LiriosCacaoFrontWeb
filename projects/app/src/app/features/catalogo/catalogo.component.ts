import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo, Categoria, Producto } from '@core/catalogo/catalogo.models';
import { FUENTE_CATALOGO } from '@core/catalogo/catalogo.fuente';
import { itemPaquete, itemSimple } from '@core/catalogo/catalogo.carrito';
import { CartService } from '@features/cart/cart.service';
import { Icono, NombreIcono } from '@ui/icono/icono';

/** El icono que le toca a cada categoría, por su slug. */
const ICONO_CATEGORIA: Readonly<Record<string, NombreIcono>> = {
  chocofrutas: 'chocofruta',
  helados: 'helado',
  bebidas: 'bebida',
  paquetes: 'paquete',
  comida: 'comida',
};

@Component({
  selector: 'lc-catalogo',
  standalone: true,
  imports: [Icono, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
})
export class CatalogoComponent {
  private readonly fuente = inject(FUENTE_CATALOGO);
  private readonly carrito = inject(CartService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  readonly datos = signal<Catalogo | null>(null);
  readonly filtro = signal('todos');
  readonly busca = signal('');

  constructor() {
    // La fuente es asincrona desde hoy aunque los datos esten quemados: asi
    // el dia del backend no hay que volver asincrona esta pantalla.
    this.fuente.obtener().then(c => this.datos.set(c));

    // El inicio abre el catalogo ya filtrado (?cat=) o ya buscando (?q=).
    // Va suscrito y no leido del snapshot porque desde el propio catalogo se
    // puede navegar a otra categoria sin que el componente se vuelva a crear.
    this.ruta.queryParamMap.subscribe(p => {
      this.filtro.set(p.get('cat') ?? 'todos');
      this.busca.set(p.get('q') ?? '');
    });
  }

  readonly categorias = computed<readonly Categoria[]>(() => {
    const c = this.datos();
    if (!c) return [];
    return [...c.categorias].filter(x => x.disponible).sort((a, b) => a.orden - b.orden);
  });

  readonly mostrandoPaquetes = computed(() => this.filtro() === 'cat_paquete');

  readonly paquetes = computed(() => {
    const c = this.datos();
    if (!c) return [];
    return [...c.paquetes].filter(p => p.disponible).sort((a, b) => a.orden - b.orden);
  });

  readonly productos = computed<readonly Producto[]>(() => {
    const c = this.datos();
    if (!c || this.mostrandoPaquetes()) return [];

    const q = this.busca().trim().toLowerCase();

    // El orden lo manda `categorias.orden`, no el id. Ordenar por id es
    // alfabetico, y alfabeticamente los cafes van primero: el catalogo
    // abria con ocho productos que todavia no se pueden comprar.
    const porCategoria = new Map(c.categorias.map(x => [x.id, x.orden]));

    return [...c.productos]
      .filter(p => this.filtro() === 'todos' || p.categoriaId === this.filtro())
      .filter(p => !q || `${p.nombre} ${p.descripcion}`.toLowerCase().includes(q))
      .sort((a, b) =>
        (porCategoria.get(a.categoriaId) ?? 99) - (porCategoria.get(b.categoriaId) ?? 99)
        || a.orden - b.orden);
  });

  /** La categoría que se está mirando no tiene nada, y eso es un dato. */
  readonly categoriaVacia = computed(() => {
    const c = this.datos();
    if (!c || this.mostrandoPaquetes() || this.productos().length) return null;
    if (this.busca().trim()) return null;
    return c.categorias.find(x => x.id === this.filtro()) ?? null;
  });

  icono(slug: string): NombreIcono {
    return ICONO_CATEGORIA[slug] ?? 'catalogo';
  }

  escribir(valor: string): void {
    this.busca.set(valor);
  }

  elegirFiltro(id: string): void {
    this.filtro.set(id);
  }

  /**
   * Un producto configurable abre su pantalla; uno simple entra al carrito de
   * una vez. Es la diferencia entre una chocofruta y una paleta, y sale del
   * dato (`configuradorId`), no de un `if` por categoría.
   */
  tocar(p: Producto): void {
    if (p.configuradorId !== null) {
      this.router.navigate(['/producto', p.slug]);
      return;
    }
    const item = itemSimple(p);
    if (item) this.carrito.add(item);
  }

  agregarPaquete(id: string): void {
    const c = this.datos();
    const q = c?.paquetes.find(x => x.id === id);
    if (!q) return;
    const item = itemPaquete(q);
    if (item) this.carrito.add(item);
  }

  /** Las fotos con las que se arma la portada de un paquete. */
  fotosDe(categoriaId: string): readonly string[] {
    const c = this.datos();
    if (!c) return [];
    return c.productos
      .filter(p => p.categoriaId === categoriaId && p.imagen)
      .slice(0, 3)
      .map(p => p.imagen as string);
  }
}

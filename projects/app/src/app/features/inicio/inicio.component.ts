import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Catalogo, Categoria, Paquete, Producto } from '@core/catalogo/catalogo.models';
import { ENVIO_DOMICILIO, ModoEntrega, guardarEntrega, leerEntrega } from '@core/pedido/pedido.datos';
import { FUENTE_CATALOGO } from '@core/catalogo/catalogo.fuente';
import { itemPaquete, itemSimple } from '@core/catalogo/catalogo.carrito';
import { CartService } from '@features/cart/cart.service';
import { Icono, NombreIcono } from '@ui/icono/icono';

const ICONO_CATEGORIA: Readonly<Record<string, NombreIcono>> = {
  chocofrutas: 'chocofruta',
  helados: 'helado',
  bebidas: 'bebida',
  paquetes: 'paquete',
  comida: 'comida',
};

/**
 * La portada de la app.
 *
 * Es solo producto: entrega, buscador, categorías, lo más pedido y paquetes.
 * No lleva nada de floristería, eventos ni enlaces a la landing — ese
 * contenido se fue a www.liriosycacao.com y este dominio es la aplicación de
 * pedidos y nada más.
 */
@Component({
  selector: 'lc-inicio',
  standalone: true,
  imports: [Icono, CurrencyPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  // El selector de entrega sale de localStorage: en el servidor siempre
  // diria "a domicilio" y al hidratar no coincidiria con lo que el navegador
  // ya sabe.
  host: { ngSkipHydration: 'true' },
})
export class InicioComponent {
  private readonly fuente = inject(FUENTE_CATALOGO);
  private readonly carrito = inject(CartService);
  private readonly router = inject(Router);

  readonly datos = signal<Catalogo | null>(null);

  /** Lo que cuesta llevarlo, para decirlo aqui y no al final. */
  readonly envio = ENVIO_DOMICILIO;

  readonly entrega = signal<ModoEntrega>(leerEntrega().entrega);

  constructor() {
    this.fuente.obtener().then(c => this.datos.set(c));
  }

  /**
   * Se guarda al momento, asi que el cierre abre con la eleccion ya hecha.
   * Es la misma decision; preguntarla dos veces seria trabajo repetido.
   */
  elegirEntrega(modo: ModoEntrega): void {
    this.entrega.set(modo);
    guardarEntrega({ ...leerEntrega(), entrega: modo });
  }

  /**
   * Cuantos productos lista el catalogo, para que el enlace lo diga.
   *
   * Cuenta TODOS y no solo los `disponible`: el catalogo tambien los muestra
   * todos, y los ocho cafes sin precio salen ahi aunque no se puedan
   * comprar. Si el enlace dijera 21 y el catalogo 29, uno de los dos miente.
   */
  readonly cuantos = computed(() => this.datos()?.productos.length ?? 0);

  readonly categorias = computed<readonly Categoria[]>(() => {
    const c = this.datos();
    if (!c) return [];
    return [...c.categorias].filter(x => x.disponible).sort((a, b) => a.orden - b.orden);
  });

  readonly destacados = computed<readonly Producto[]>(() => {
    const c = this.datos();
    if (!c) return [];
    return [...c.productos]
      .filter(p => p.destacado && p.disponible && p.precio !== null)
      .sort((a, b) => a.orden - b.orden)
      // Cuatro: lo que cabe en dos filas de la rejilla sin que el inicio se
      // convierta en un segundo catalogo.
      .slice(0, 4);
  });

  readonly paquetes = computed<readonly Paquete[]>(() => {
    const c = this.datos();
    if (!c) return [];
    return [...c.paquetes].filter(p => p.disponible).sort((a, b) => a.orden - b.orden);
  });

  /**
   * Los cafés se muestran aunque no tengan precio: existen, la gente
   * pregunta por ellos, y esconderlos no los hace aparecer. El botón de
   * agregar sí queda apagado.
   */
  readonly cafes = computed<readonly Producto[]>(() => {
    const c = this.datos();
    if (!c) return [];
    return [...c.productos]
      .filter(p => p.categoriaId === 'cat_bebida')
      .sort((a, b) => a.orden - b.orden)
      .slice(0, 3);
  });

  icono(slug: string): NombreIcono {
    return ICONO_CATEGORIA[slug] ?? 'catalogo';
  }

  /** El catálogo recibe el filtro por la ruta y abre ya en esa categoría. */
  verCategoria(id: string): void {
    this.router.navigate(['/productos'], { queryParams: { cat: id } });
  }

  verTodo(): void {
    this.router.navigate(['/productos']);
  }

  buscar(texto: string): void {
    const q = texto.trim();
    this.router.navigate(['/productos'], q ? { queryParams: { q } } : {});
  }

  tocar(p: Producto, ev?: Event): void {
    if (p.configuradorId !== null) {
      this.marcarFoto(ev);
      this.router.navigate(['/producto', p.slug]);
      return;
    }
    const item = itemSimple(p);
    if (item) this.carrito.add(item);
  }

  agregarPaquete(q: Paquete): void {
    const item = itemPaquete(q, this.fotosDe(q.categoriaId));
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

  /**
   * Le pone el nombre de transición a la foto que se acaba de tocar.
   *
   * Se escribe en el DOM directamente y no por `[style]` porque el navegador
   * saca la foto del estado anterior en el mismo instante en que arranca la
   * navegación: si esperara a que Angular pintara, llegaría tarde y la foto
   * aparecería de golpe en vez de crecer.
   *
   * Solo puede haber UN elemento con cada nombre a la vez, por eso se marca
   * la tocada y nada más.
   */
  private marcarFoto(ev?: Event): void {
    const foto = (ev?.currentTarget as HTMLElement | undefined)
      ?.closest('article')
      ?.querySelector<HTMLElement>('img');
    if (!foto) return;
    foto.style.viewTransitionName = 'foto-producto';
    // Se quita al volver: si se quedara puesto, la siguiente transición
    // tendría dos elementos con el mismo nombre y no animaría ninguno.
    setTimeout(() => (foto.style.viewTransitionName = ''), 600);
  }
}

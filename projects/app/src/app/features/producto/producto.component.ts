import { CurrencyPipe, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo, Eleccion, Grupo, LineaPedido, Opcion } from '@core/catalogo/catalogo.models';
import { FUENTE_CATALOGO } from '@core/catalogo/catalogo.fuente';
import { desglose, gruposVisibles, opcionesDe, precioUnitario } from '@core/catalogo/catalogo.precio';
import { itemConfigurado } from '@core/catalogo/catalogo.carrito';
import { CartService } from '@features/cart/cart.service';
import { Hoja } from '@ui/hoja/hoja';
import { Icono } from '@ui/icono/icono';

/** Un grupo con sus opciones ya resueltas, listo para dibujar. */
interface GrupoVista {
  readonly grupo: Grupo;
  readonly opciones: readonly OpcionVista[];
}

interface OpcionVista {
  readonly opcion: Opcion;
  readonly elegida: boolean;
  /** 'incluido', '+Q2.00' o vacío. */
  readonly delta: string;
  /** El sub-grupo que esta opción despliega, si está elegida. */
  readonly abre: GrupoVista | null;
}

@Component({
  selector: 'lc-producto',
  standalone: true,
  imports: [Icono, Hoja, CurrencyPipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss',
})
export class ProductoComponent {
  private readonly fuente = inject(FUENTE_CATALOGO);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ubicacion = inject(Location);
  private readonly carrito = inject(CartService);

  readonly datos = signal<Catalogo | null>(null);
  readonly elecciones = signal<readonly Eleccion[]>([]);
  readonly cantidad = signal(1);

  private readonly slug = signal(this.ruta.snapshot.paramMap.get('slug') ?? '');

  constructor() {
    this.fuente.obtener().then(c => {
      this.datos.set(c);
      this.elecciones.set(this.porDefecto(c));
    });
  }

  readonly producto = computed(() => {
    const c = this.datos();
    return c?.productos.find(p => p.slug === this.slug()) ?? null;
  });

  /**
   * Los grupos que se dibujan sueltos, cada uno con sus opciones y con el
   * sub-grupo que alguna de ellas despliegue.
   *
   * Todo sale del dato: que un grupo sea de uno o de varios, cuántas opciones
   * van incluidas y qué opción abre qué. No hay un `if` por nombre de topping.
   */
  readonly grupos = computed<readonly GrupoVista[]>(() => {
    const c = this.datos();
    const p = this.producto();
    if (!c || !p || p.configuradorId === null) return [];
    return gruposVisibles(c, p.configuradorId).map(g => this.vistaDe(c, g));
  });

  readonly total = computed(() => {
    const c = this.datos();
    const linea = this.linea();
    if (!c || !linea) return null;
    return precioUnitario(c, linea);
  });

  readonly detalle = computed(() => {
    const c = this.datos();
    const linea = this.linea();
    if (!c || !linea) return [];
    return desglose(c, linea);
  });

  /**
   * Lo que lleva armado, en una linea.
   *
   * Sin esto hay que desplazar hacia arriba para recordar que se eligio, y
   * en un grupo largo de toppings eso pasa todo el tiempo. Sale de los
   * grupos ya resueltos, asi que incluye los sub-grupos desplegados.
   */
  readonly resumen = computed<readonly string[]>(() => {
    const nombres: string[] = [];
    const recorrer = (gv: GrupoVista): void => {
      for (const ov of gv.opciones) {
        if (!ov.elegida) continue;
        nombres.push(ov.opcion.nombre);
        if (ov.abre) recorrer(ov.abre);
      }
    };
    for (const gv of this.grupos()) recorrer(gv);
    return nombres;
  });

  /** El chocolate elegido, para la insignia sobre la foto. */
  readonly chocolate = computed<Opcion | null>(() => {
    const c = this.datos();
    if (!c) return null;
    const base = c.grupos.find(g => g.visible && g.tipo === 'uno');
    if (!base) return null;
    const e = this.elecciones().find(x => x.grupoId === base.id);
    return c.opciones.find(o => o.id === e?.opcionId) ?? null;
  });

  // ------------------------------------------------------------------ actos

  alternar(g: Grupo, o: Opcion): void {
    const actuales = this.elecciones();

    if (g.tipo === 'uno') {
      this.elecciones.set([
        ...actuales.filter(e => e.grupoId !== g.id),
        { grupoId: g.id, opcionId: o.id },
      ]);
      return;
    }

    const puesta = actuales.some(e => e.grupoId === g.id && e.opcionId === o.id);
    if (puesta) {
      // Al quitar una opción se va con ella lo que haya desplegado: el color
      // de unas líneas que ya no existen no debe seguir elegido.
      const hijo = o.abreGrupoId;
      this.elecciones.set(
        actuales.filter(e => !(e.grupoId === g.id && e.opcionId === o.id) && e.grupoId !== hijo),
      );
      return;
    }

    if (g.maximo !== null && actuales.filter(e => e.grupoId === g.id).length >= g.maximo) return;

    const nuevas: Eleccion[] = [...actuales, { grupoId: g.id, opcionId: o.id }];
    const c = this.datos();
    if (o.abreGrupoId && c) {
      const hijo = c.grupos.find(x => x.id === o.abreGrupoId);
      const primera = hijo ? opcionesDe(c, hijo)[0] : undefined;
      if (hijo && primera) nuevas.push({ grupoId: hijo.id, opcionId: primera.id });
    }
    this.elecciones.set(nuevas);
  }

  mas(): void { this.cantidad.update(n => n + 1); }
  menos(): void { this.cantidad.update(n => Math.max(1, n - 1)); }
  volver(): void { this.ubicacion.back(); }

  agregar(): void {
    const c = this.datos();
    const linea = this.linea();
    if (!c || !linea) return;
    const armado = itemConfigurado(c, linea);
    if (!armado) return;
    this.carrito.add(armado.item);
    this.router.navigate(['/carrito']);
  }

  // --------------------------------------------------------------- internos

  private linea(): LineaPedido | null {
    const p = this.producto();
    if (!p) return null;
    return { productoId: p.id, elecciones: this.elecciones(), cantidad: this.cantidad() };
  }

  /** Los grupos obligatorios arrancan con su primera opción puesta. */
  private porDefecto(c: Catalogo): Eleccion[] {
    const p = c.productos.find(x => x.slug === this.slug());
    if (!p || p.configuradorId === null) return [];

    const puestas: Eleccion[] = [];
    for (const g of c.grupos) {
      if (g.configuradorId !== p.configuradorId || !g.obligatorio || !g.visible) continue;
      const opciones = opcionesDe(c, g);
      // El tradicional primero si existe: es el que no cobra extra.
      const inicial = opciones.find(o => o.precioExtra === 0) ?? opciones[0];
      if (inicial) puestas.push({ grupoId: g.id, opcionId: inicial.id });
    }
    return puestas;
  }

  private vistaDe(c: Catalogo, g: Grupo): GrupoVista {
    const puestas = this.elecciones().filter(e => e.grupoId === g.id);
    const opciones = opcionesDe(c, g).map((o): OpcionVista => {
      const pos = puestas.findIndex(e => e.opcionId === o.id);
      const elegida = pos !== -1;
      const hijo = o.abreGrupoId ? c.grupos.find(x => x.id === o.abreGrupoId) : undefined;

      return {
        opcion: o,
        elegida,
        delta: this.deltaDe(g, o, pos, puestas.length),
        abre: elegida && hijo ? this.vistaDe(c, hijo) : null,
      };
    });

    return { grupo: g, opciones };
  }

  /**
   * Lo que se le dice al cliente que cuesta esta opción, aquí y ahora.
   *
   * No es `precioExtra` a secas: con `incluidas` en 1, la primera que marque
   * no cobra, y mientras no haya marcado ninguna todas se anuncian incluidas.
   */
  private deltaDe(g: Grupo, o: Opcion, pos: number, puestas: number): string {
    if (o.precioExtra === 0) return '';
    const gratis = (pos !== -1 && pos < g.incluidas) || (pos === -1 && puestas < g.incluidas);
    if (gratis) return 'incluido';
    return `+Q${o.precioExtra.toFixed(2)}`;
  }
}

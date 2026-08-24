import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import {
  Flor,
  Ocasion,
  OCASIONES,
  OcasionInfo,
  floresPorFamilia,
  PRECIO_FLOR_DESDE,
} from '@core/domain';
import { ItemCotizable } from '@core/ui-models/cotizable';
import { SeoService } from '@core/services/seo.service';
import { CotizacionDialogComponent } from '@features/listproducts/components/cotizacion-dialog/cotizacion-dialog.component';
import { BandaEstacionalComponent } from './banda-estacional/banda-estacional.component';

/**
 * Pagina de floristeria.
 *
 * A diferencia de /eventos, esta NO reemplaza al catalogo: las flores tienen
 * precio y foto, y funcionan bien en la cuadricula de /productos. Esta pagina
 * es una puerta ADICIONAL, la que entra por ocasion.
 *
 * El motivo: nadie busca "bouquet girasol floral". Busca "algo para el
 * cumpleanos de mi mama, como de Q300". El catalogo esta ordenado por lo que
 * el negocio hace; esta pagina, por lo que el cliente viene a comprar.
 *
 * Sin filtro de presupuesto a proposito. Con 9 productos, dos filtros dejan
 * casi cualquier combinacion en uno o cero resultados, y una cuadricula vacia
 * se lee como "no tienen nada". En su lugar el precio va visible, ordenado de
 * menor a mayor, y el "desde" va en el hero.
 */
@Component({
  selector: 'app-floristeria',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CotizacionDialogComponent, BandaEstacionalComponent],
  templateUrl: './floristeria.component.html',
  styleUrl: './floristeria.component.scss',
})
export class FloristeriaComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly seo = inject(SeoService);

  readonly ocasiones: OcasionInfo[] = OCASIONES;

  /**
   * Arreglo de la portada. Se elige a mano: se busca el que mejor resume las
   * dos mitades del negocio (flores y color), no el mas caro ni el primero.
   */
  readonly fotoPortada = 'assets/img/flores/bouquetgirasolfloral.PNG';
  readonly precioDesde = PRECIO_FLOR_DESDE;

  private readonly flores = floresPorFamilia('flor');
  private readonly fresas = floresPorFamilia('fresas');
  private readonly pasteleria = floresPorFamilia('pasteleria');

  /** null = sin filtrar, se ven todos. */
  ocasionActiva: Ocasion | null = null;

  itemSeleccionado: ItemCotizable | null = null;
  dialogoVisible = false;

  ngOnInit(): void {
    this.titleService.setTitle(
      'Floristería en Chiquimula: ramos de rosas, girasoles y fresas con chocolate | Lirio & Cacao'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        `Arreglos florales en Chiquimula desde Q${this.precioDesde}. Ramos de rosas y girasoles, ` +
        'bouquets de fresas cubiertas de chocolate premium y cajitas de regalo. Todos con ' +
        'tarjeta de dedicatoria. Entrega a domicilio o recoger en local.',
    });

    this.seo.limpiarJsonLdDePagina();
    this.seo.insertItemListSchema(
      'Floristería en Chiquimula',
      [...this.flores, ...this.fresas].map(f => ({ title: f.nombre, price: f.precio }))
    );
  }

  // --- filtro por ocasion ---

  get floresFiltradas(): Flor[] { return this.filtrar(this.flores); }
  get fresasFiltradas(): Flor[] { return this.filtrar(this.fresas); }
  get hayPasteleria(): boolean { return this.pasteleria.length > 0; }

  private filtrar(lista: Flor[]): Flor[] {
    if (!this.ocasionActiva) return lista;
    return lista.filter(f => f.ocasiones.includes(this.ocasionActiva!));
  }

  /** El filtro es un interruptor: tocar la ocasion activa la quita. */
  elegirOcasion(id: Ocasion): void {
    this.ocasionActiva = this.ocasionActiva === id ? null : id;
  }

  quitarFiltro(): void {
    this.ocasionActiva = null;
  }

  get etiquetaActiva(): string | null {
    return this.ocasiones.find(o => o.id === this.ocasionActiva)?.etiqueta ?? null;
  }

  get sinResultados(): boolean {
    return this.floresFiltradas.length === 0 && this.fresasFiltradas.length === 0;
  }

  // --- dialogo ---

  abrir(flor: Flor): void {
    this.itemSeleccionado = {
      nombre: flor.nombre,
      descripcion: flor.descripcion,
      precio: flor.precio,
      imagenUrl: flor.imagenUrl,
      incluye: flor.incluye,
      personalizaciones: flor.personalizaciones,
      notas: flor.notas,
      // Las flores no llevan cuestionario: el producto ya es la especificacion.
      usaCuestionario: false,
    };
    this.dialogoVisible = true;
  }

  trackPorId(_: number, flor: Flor): string {
    return flor.id;
  }
}

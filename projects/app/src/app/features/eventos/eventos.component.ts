import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';

import { Evento, eventosPorTipo } from '@core/domain';
import { ItemCotizable } from '@core/ui-models/cotizable';
import { SeoService } from '@core/services/seo.service';
import { CotizacionDialogComponent } from '@features/listproducts/components/cotizacion-dialog/cotizacion-dialog.component';
import { CotizadorEventoComponent } from '@features/listproducts/components/cotizador-evento/cotizador-evento.component';

/**
 * Pagina de eventos.
 *
 * Existe por una razon concreta: los eventos son el producto de mayor ticket
 * del negocio (jardin propio, mobiliario, decoracion, comida y sonido) y hasta
 * ahora vivian como el quinto chip del catalogo, compitiendo por atencion con
 * una chocofruta de Q7. El mismo tipo de tarjeta para las dos cosas hacia que
 * el sitio no dijera en ningun lado lo que el negocio realmente hace.
 *
 * El orden de las secciones no es decorativo:
 *   1. Hero      - decir de una que se organiza el evento completo.
 *   2. Jardines  - el diferenciador. Tener lugar propio es lo que la
 *                  competencia no tiene, asi que va arriba y no enterrado
 *                  como un "paquete" mas.
 *   3. Servicios - la lista de lo que se cubre, para el que llega con el
 *                  lugar ya resuelto.
 *   4. Celebraciones - las fotos reales, que es lo que de verdad convence.
 *   5. Cuestionario  - el cierre.
 *
 * No reescribe nada: reusa el seed, ItemCotizable y los dos dialogos que ya
 * existian para el catalogo.
 */
@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DialogModule,
    CotizacionDialogComponent,
    CotizadorEventoComponent,
  ],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
})
export class EventosComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly seo = inject(SeoService);

  readonly jardines = eventosPorTipo('lugar');
  readonly celebraciones = eventosPorTipo('celebracion');
  readonly servicios = eventosPorTipo('servicio');

  /**
   * Foto de portada del hero.
   *
   * Se elige a mano y no se deriva del primer jardin: la foto del jardin
   * VACIO ensena el espacio pero no vende: quien entra aqui esta imaginando
   * su fiesta, no un patio. Una foto de montaje terminado hace ese trabajo.
   *
   * Otras candidatas, por si esta no convence:
   *   assets/img/eventos/pedida-de-mano/1.jpg   arco con velas de noche
   *   assets/img/eventos/quinceanos/1.jpg       arcos iluminados
   *   assets/img/eventos/jardin-1/1.jpg         el jardin vacio
   */
  readonly fotoHero = 'assets/img/eventos/boda/1.jpg';

  /**
   * Lo que se cubre, dicho como lo dice la duena.
   *
   * Va escrito aqui y no derivado de los `incluye` de cada paquete: eso son
   * listas por paquete, y lo que hace falta en esta seccion es la frase de
   * posicionamiento del negocio completo.
   */
  readonly queCubrimos: string[] = [
    'Jardín para el evento',
    'Mobiliario y mantelería',
    'Decoración y montaje',
    'Comida',
    'Disco y sonido',
    'Letras 3D, mamparas y letreros',
  ];

  // --- dialogos ---

  itemSeleccionado: ItemCotizable | null = null;
  dialogoVisible = false;

  /** El cuestionario general, el que se abre desde el hero. */
  cuestionarioVisible = false;

  ngOnInit(): void {
    this.titleService.setTitle(
      'Organización de eventos en Chiquimula — jardín, mobiliario, decoración y comida | Lirio & Cacao'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Organizamos tu evento completo en Chiquimula: jardín para hasta 150 personas, ' +
        'mobiliario, decoración, comida, disco y letras 3D. Bodas, 15 años, cumpleaños ' +
        'temáticos y pedidas de mano. Cotiza por WhatsApp.',
    });

    // El bloque de la pagina anterior sigue en el head al navegar sin
    // recargar, asi que primero se limpia y luego se pone el de esta.
    this.seo.limpiarJsonLdDePagina();
    this.seo.insertEventosSchema(this.celebraciones, this.jardines);
  }

  /**
   * Un evento se muestra en el mismo dialogo que las flores: los dos son
   * productos que se conversan por WhatsApp en vez de comprarse en linea.
   */
  abrirPaquete(evento: Evento): void {
    this.itemSeleccionado = {
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      // Sin precioDesde no se pinta precio: en un montaje a medida no hay
      // un "desde" honesto que mostrar.
      precio: evento.precioDesde ?? 0,
      esDesde: evento.precioDesde != null,
      modalidad: evento.modalidad,
      imagenUrl: evento.imagenUrl,
      galeria: evento.galeria,
      capacidad: evento.capacidad,
      incluye: evento.incluye,
      noIncluye: evento.noIncluye,
      personalizaciones: evento.personalizaciones,
      notas: evento.notas,
      usaCuestionario: true,
    };
    this.dialogoVisible = true;
  }

  abrirCuestionario(): void {
    this.cuestionarioVisible = true;
  }

  cerrarCuestionario(): void {
    this.cuestionarioVisible = false;
  }

  /**
   * Cuantas fotos tiene un paquete. Se ensena en la tarjeta ("4 fotos")
   * porque invita a abrir: las fotos reales de eventos hechos son lo que
   * convence, mas que cualquier texto.
   */
  totalFotos(evento: Evento): number {
    return 1 + (evento.galeria?.length ?? 0);
  }

  trackPorId(_: number, evento: Evento): string {
    return evento.id;
  }
}

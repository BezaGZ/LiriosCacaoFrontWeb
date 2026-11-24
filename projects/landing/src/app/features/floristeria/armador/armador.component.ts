import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { OCASIONES, Ocasion, ocasionDeTemporada } from '../../../core/ocasiones/ocasiones';
import { armarMensajeFlor, faltaParaFlor } from '../../../core/pedido-flor/mensaje-flor';
import { WhatsappService } from '../../../core/whatsapp/whatsapp.service';
import { FLORISTERIA, NEGOCIO } from '../../../contenido/sitio';

/**
 * Arma el pedido antes de mandarlo.
 *
 * El sitio terminaba en un boton que abria un chat vacio, y un chat vacio es
 * donde se cae la mitad de la gente: hay que redactar desde cero y decir que
 * se quiere sin saber que hay. Aqui se elige, se ve el mensaje escrito, y se
 * manda.
 *
 * Ensenar el mensaje antes de enviarlo no es un adorno: quita el miedo a
 * tocar un boton de WhatsApp sin saber que va a salir a nombre de uno.
 *
 * Lleva `ngSkipHydration` porque preselecciona la ocasion segun la FECHA de
 * hoy. Las paginas se generan al compilar, asi que el servidor congelaria el
 * dia del build y en mayo seguiria preseleccionando lo de noviembre.
 */
@Component({
  selector: 'lc-armador',
  templateUrl: './armador.component.html',
  styleUrl: './armador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
})
export class ArmadorComponent {
  private readonly whatsapp = inject(WhatsappService);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly ocasiones = OCASIONES;

  /** Solo lo que de verdad se cotiza: la tarjeta va incluida, no es un pedido. */
  protected readonly arreglos = FLORISTERIA.pagina.queHacemos.filter(
    (a) => (a as { esProducto?: boolean }).esProducto !== false,
  );

  /**
   * Si viene una ocasion en el calendario, arranca elegida. Alguien que entra
   * tres dias antes del Dia de la Madre viene por eso; hacerselo elegir otra
   * vez es trabajo repetido.
   */
  private readonly deTemporada: Ocasion | null = this.esNavegador
    ? ocasionDeTemporada(new Date())
    : null;

  protected readonly ocasion = signal<string | null>(this.deTemporada?.id ?? null);
  protected readonly arreglo = signal<string | null>(null);
  protected readonly fecha = signal<string | null>(null);

  private readonly pedido = computed(() => ({
    ocasion: this.ocasiones.find((o) => o.id === this.ocasion())?.enMensaje ?? null,
    arreglo:
      this.arreglos.find((a) => a.titulo === this.arreglo())?.enMensaje ?? null,
    fecha: this.fecha(),
    ciudad: NEGOCIO.direccion.ciudad ?? 'Chiquimula',
  }));

  protected readonly falta = computed(() => faltaParaFlor(this.pedido()));
  protected readonly mensaje = computed(() => armarMensajeFlor(this.pedido()));
  protected readonly enlace = computed(() => this.whatsapp.enlace(this.mensaje()));

  /** No se aceptan fechas pasadas: una entrega de ayer no existe. */
  protected readonly minimo = new Date().toISOString().slice(0, 10);

  protected elegirOcasion(id: string): void {
    this.ocasion.set(id || null);
  }

  protected elegirArreglo(valor: string): void {
    this.arreglo.set(valor || null);
  }

  protected elegirFecha(valor: string): void {
    this.fecha.set(valor || null);
  }
}

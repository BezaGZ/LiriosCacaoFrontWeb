import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { armarMensajeJardin, faltaParaJardin } from '../../../core/pedido-jardin/mensaje-jardin';
import { WhatsappService } from '../../../core/whatsapp/whatsapp.service';
import { JARDIN } from '../../../contenido/sitio';

/**
 * Arma la consulta de disponibilidad antes de mandarla.
 *
 * El cierre de esta pagina era un boton que abria un chat vacio y pedia por
 * escrito "comparta la fecha y cuantas personas son". Pedirle a alguien que
 * redacte eso es justo lo que no hace: aqui lo elige en tres toques y ve el
 * mensaje escrito antes de enviarlo.
 *
 * No lleva `ngSkipHydration`: aqui no se preselecciona nada segun el dia, y
 * la fecha minima la pone el navegador al montarse.
 */
@Component({
  selector: 'lc-consulta-jardin',
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaJardinComponent {
  private readonly whatsapp = inject(WhatsappService);

  protected readonly c = JARDIN.consulta;

  protected readonly fecha = signal<string | null>(null);
  protected readonly celebracion = signal<string | null>(null);
  protected readonly invitados = signal<string | null>(null);

  private readonly consulta = computed(() => ({
    fecha: this.fecha(),
    celebracion:
      this.c.celebraciones.find((x) => x.etiqueta === this.celebracion())?.enMensaje ?? null,
    invitados: this.invitados(),
  }));

  protected readonly falta = computed(() => faltaParaJardin(this.consulta()));
  protected readonly mensaje = computed(() => armarMensajeJardin(this.consulta()));
  protected readonly enlace = computed(() => this.whatsapp.enlace(this.mensaje()));

  /** Una fecha pasada no se puede reservar. */
  protected readonly minimo = new Date().toISOString().slice(0, 10);

  protected elegirFecha(v: string): void { this.fecha.set(v || null); }
  protected elegirCelebracion(v: string): void { this.celebracion.set(v || null); }
  protected elegirInvitados(v: string): void { this.invitados.set(v || null); }
}

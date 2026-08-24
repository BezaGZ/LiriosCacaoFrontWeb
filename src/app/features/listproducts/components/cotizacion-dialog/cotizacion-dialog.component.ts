import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ItemCotizable } from '@core/ui-models/cotizable';
import { CotizadorEventoComponent } from '../cotizador-evento/cotizador-evento.component';
import { abrirWhatsApp } from '@core/config/contacto.config';
import { IMG_PLACEHOLDER } from '@core/utils/image-resolver';

/**
 * Dialogo para los productos que se cotizan en vez de comprarse en linea:
 * flores y paquetes de evento. Los dos tienen la misma forma (ItemCotizable),
 * asi que comparten este dialogo en lugar de tener uno casi identico cada uno.
 */
@Component({
  selector: 'app-cotizacion-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, CotizadorEventoComponent],
  templateUrl: './cotizacion-dialog.component.html',
  styleUrl: './cotizacion-dialog.component.scss'
})
export class CotizacionDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  /** Fotos que si cargaron. Empieza con todas y se van quitando las rotas. */
  fotos: string[] = [];
  fotoActiva = 0;

  /** El cuestionario reemplaza al detalle cuando el visitante lo pide. */
  mostrandoCuestionario = false;

  @Input() set item(valor: ItemCotizable | null) {
    this._item = valor;
    this.mostrandoCuestionario = false;
    // La portada primero y luego la galeria. Se filtran vacios por si el seed
    // trae huecos.
    this.fotos = [valor?.imagenUrl, ...(valor?.galeria ?? [])].filter(Boolean) as string[];
    this.fotoActiva = 0;
  }
  get item(): ItemCotizable | null { return this._item; }
  private _item: ItemCotizable | null = null;

  get tieneGaleria(): boolean { return this.fotos.length > 1; }

  verFoto(i: number): void { this.fotoActiva = i; }

  /**
   * Una foto que no existe se QUITA de la galeria, no se reemplaza por el
   * placeholder: la duena sube las fotos poco a poco y no tiene sentido
   * mostrar cuatro tarjetas de "foto proximamente" seguidas.
   *
   * Si al final no queda ninguna, el template muestra el placeholder una vez.
   */
  onFotoError(ruta: string): void {
    this.fotos = this.fotos.filter(f => f !== ruta);
    if (this.fotoActiva >= this.fotos.length) {
      this.fotoActiva = Math.max(0, this.fotos.length - 1);
    }
  }

  readonly placeholder = IMG_PLACEHOLDER;

  close(): void {
    this.onVisibilityChange(false);
  }

  onVisibilityChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  /**
   * Los eventos abren el cuestionario; las flores van directo a WhatsApp,
   * porque ahi el producto ya dice todo lo que hay que saber.
   */
  openWhatsApp(): void {
    if (!this.item) return;

    if (this.item.usaCuestionario) {
      this.mostrandoCuestionario = true;
      return;
    }

    abrirWhatsApp(this.mensaje());
  }

  volverAlDetalle(): void {
    this.mostrandoCuestionario = false;
  }

  private mensaje(): string {
    const i = this.item!;
    const precio = i.precio > 0
      ? `${i.esDesde ? 'Desde ' : 'Precio: '}Q${i.precio.toFixed(2)}\n`
      : '';

    return [
      '¡Hola! Me interesa:',
      '',
      `*${i.nombre}*`,
      precio + (i.capacidad ? `Capacidad: ${i.capacidad} personas\n` : ''),
      'Me gustaría obtener más información.',
    ].join('\n');
  }
}

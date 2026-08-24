import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { abrirWhatsApp } from '@core/config/contacto.config';

interface Opcion { id: string; etiqueta: string; }

/**
 * Cuestionario corto para cotizar un evento.
 *
 * Por que existe: un boton de WhatsApp vacio obliga a la duena a preguntar
 * lo mismo cinco veces por chat (que celebras, para cuantos, que necesitas,
 * cuando). Aqui se pregunta una sola vez y el mensaje llega listo para
 * cotizar.
 *
 * Cada campo que se agrega pierde gente, asi que solo OCASION y NECESITA son
 * obligatorios: con esos dos ya se puede empezar la conversacion. El resto es
 * opcional, y siempre hay una salida ("Prefiero solo escribir") para quien no
 * quiere llenar nada.
 */
@Component({
  selector: 'app-cotizador-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cotizador-evento.component.html',
  styleUrl: './cotizador-evento.component.scss',
})
export class CotizadorEventoComponent {
  /** Nombre del paquete desde el que se abrio, para incluirlo en el mensaje. */
  @Input() paquete: string | null = null;
  @Output() cancelar = new EventEmitter<void>();

  readonly ocasiones: Opcion[] = [
    { id: '15 años',     etiqueta: '15 años' },
    { id: 'Graduación',  etiqueta: 'Graduación' },
    { id: 'Cumpleaños',  etiqueta: 'Cumpleaños' },
    { id: 'Boda',        etiqueta: 'Boda' },
    { id: 'Otro',        etiqueta: 'Otro' },
  ];

  readonly necesidades: Opcion[] = [
    { id: 'lugar',      etiqueta: 'Lugar (jardín)' },
    { id: 'mobiliario', etiqueta: 'Mobiliario' },
    { id: 'decoracion', etiqueta: 'Decoración' },
    { id: 'comida',     etiqueta: 'Comida' },
    { id: 'disco',      etiqueta: 'Disco y sonido' },
    { id: 'letras',     etiqueta: 'Letras 3D y mampara' },
  ];

  ocasion: string | null = null;
  seleccion: string[] = [];
  personas: number | null = null;
  fecha = '';
  sinFecha = false;
  menu = '';
  colores = '';

  // --- condicionales: que campos tienen sentido segun lo que marco ---

  /** Cuantas personas importa para el lugar, el mobiliario y la comida. */
  get preguntarPersonas(): boolean {
    return this.tieneAlguno(['lugar', 'mobiliario', 'comida']);
  }

  get preguntarMenu(): boolean {
    return this.tieneAlguno(['comida']);
  }

  get preguntarColores(): boolean {
    return this.tieneAlguno(['decoracion', 'letras']);
  }

  private tieneAlguno(ids: string[]): boolean {
    return ids.some(id => this.seleccion.includes(id));
  }

  // --- interaccion ---

  elegirOcasion(id: string): void {
    this.ocasion = id;
  }

  alternar(id: string): void {
    this.seleccion = this.seleccion.includes(id)
      ? this.seleccion.filter(x => x !== id)
      : [...this.seleccion, id];
  }

  estaMarcado(id: string): boolean {
    return this.seleccion.includes(id);
  }

  /** Solo lo minimo indispensable, para no perder a quien va de paso. */
  get puedeEnviar(): boolean {
    return !!this.ocasion && this.seleccion.length > 0;
  }

  enviar(): void {
    if (!this.puedeEnviar) return;
    abrirWhatsApp(this.construirMensaje());
  }

  /** Salida para quien no quiere llenar nada. */
  soloEscribir(): void {
    const base = this.paquete
      ? `¡Hola! Me interesa *${this.paquete}*. Quisiera más información.`
      : '¡Hola! Quiero cotizar un evento.';
    abrirWhatsApp(base);
  }

  private static readonly MESES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];

  /**
   * Convierte el "2026-03-15" del input a "15 de marzo de 2026".
   *
   * OJO con la tentacion de usar `new Date('2026-03-15')`: eso se interpreta
   * como medianoche UTC, y en Guatemala (UTC-6) al formatearlo sale el dia
   * ANTERIOR. Por eso se parte la cadena a mano.
   */
  private fechaEnPalabras(iso: string): string {
    const [anio, mes, dia] = iso.split('-').map(Number);
    const nombreMes = CotizadorEventoComponent.MESES[mes - 1];
    if (!anio || !nombreMes || !dia) return iso;
    return `${dia} de ${nombreMes} de ${anio}`;
  }

  private construirMensaje(): string {
    const etiquetas = this.seleccion
      .map(id => this.necesidades.find(n => n.id === id)?.etiqueta ?? id)
      .join(', ');

    const lineas = ['¡Hola! Quiero cotizar un evento.', ''];

    if (this.paquete) lineas.push(`Paquete: ${this.paquete}`);
    lineas.push(`Ocasión: ${this.ocasion}`);
    lineas.push(`Necesito: ${etiquetas}`);

    if (this.preguntarPersonas && this.personas) {
      lineas.push(`Personas: ${this.personas}`);
    }
    if (this.sinFecha) {
      lineas.push('Fecha: aún no la tengo definida');
    } else if (this.fecha) {
      lineas.push(`Fecha: ${this.fechaEnPalabras(this.fecha)}`);
    }
    if (this.preguntarMenu && this.menu.trim()) {
      lineas.push(`Menú: ${this.menu.trim()}`);
    }
    if (this.preguntarColores && this.colores.trim()) {
      lineas.push(`Colores o tema: ${this.colores.trim()}`);
    }

    return lineas.join('\n');
  }
}

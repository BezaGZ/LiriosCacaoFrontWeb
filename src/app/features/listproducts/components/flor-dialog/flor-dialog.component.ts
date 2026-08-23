import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Flor } from '@core/domain/flor/flor.models';
import { abrirWhatsApp } from '@core/config/contacto.config';

@Component({
  selector: 'app-flor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './flor-dialog.component.html',
  styleUrl: './flor-dialog.component.scss'
})
export class FlorDialogComponent {
  @Input() flor: Flor | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onVisibilityChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  openWhatsApp(): void {
    if (!this.flor) return;

    abrirWhatsApp(this.buildWhatsAppMessage());
  }

  private buildWhatsAppMessage(): string {
    if (!this.flor) return '';

    let mensaje = `Hola! Me interesa el producto:\n\n`;
    mensaje += `*${this.flor.nombre}*\n`;
    mensaje += `Precio: Q${this.flor.precio.toFixed(2)}\n\n`;
    mensaje += `Descripción:\n${this.flor.descripcion}\n\n`;
    mensaje += `Me gustaría obtener más información.`;

    return mensaje;
  }
}

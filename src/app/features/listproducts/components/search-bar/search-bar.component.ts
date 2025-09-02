// search-bar.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import {InputGroupAddon} from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [InputGroupModule, InputTextModule, InputGroupAddon],
  // Asumo que tu HTML es similar a esto. Si no, ajústalo.
  template: `
    <p-inputGroup>
      <p-inputGroupAddon>
        <i class="pi pi-search"></i>
      </p-inputGroupAddon>
      <input
        type="text"
        pInputText
        placeholder="Busca en Lirio & Cacao"
        (input)="onInput($event)"
      />
    </p-inputGroup>
  `,
})
export class SearchBarComponent {
  // --- ¡Línea clave! ---
  @Output() searchChanged = new EventEmitter<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchChanged.emit(input.value);
  }
}

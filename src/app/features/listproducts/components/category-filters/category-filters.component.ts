// category-filters.component.ts

import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  // Asumo que tu HTML es similar a esto. Si no, ajústalo.
  template: `
    <div class="flex gap-3 overflow-x-auto pb-2">
      <p-button
        *ngFor="let category of categories"
        [label]="category.name"
        [outlined]="selectedCategory !== category.id"
        (click)="selectCategory(category.id)"
        styleClass="p-button-sm"
      ></p-button>
    </div>
  `,
})
export class CategoryFiltersComponent {
  // --- ¡Línea clave! ---
  @Output() categorySelected = new EventEmitter<string>();
  @Input() selectedCategory: string = 'all';

  categories = [
    { id: 'all', name: 'Todos' },
    { id: 'chocofruta', name: 'Chocofrutas' },
    { id: 'helado', name: 'Helados' },
    { id: 'flor', name: 'Floristería' },
    { id: 'evento', name: 'Eventos' },
  ];

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.categorySelected.emit(categoryId);
  }
}

// category-filters.component.ts

import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filters.component.html',
  styleUrls: ['./category-filters.component.scss']
})
export class CategoryFiltersComponent {
  @Output() categorySelected = new EventEmitter<string>();
  @Input() selectedCategory: string = 'all';

  categories = [
    { id: 'all', name: 'Todos', image: 'assets/categories/todos.png' },
    { id: 'chocofruta', name: 'Chocofrutas', image: 'assets/categories/chocofruta.png' },
    { id: 'helado', name: 'Helados', image: 'assets/categories/helados.png' },
    { id: 'flor', name: 'Floristería', image: 'assets/categories/floristeria.png' },
    { id: 'evento', name: 'Eventos', image: 'assets/categories/eventos.png' },
  ];

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.categorySelected.emit(categoryId);
  }
}

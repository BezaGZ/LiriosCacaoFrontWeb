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
    { id: 'all', name: 'Todos' },
    { id: 'chocofruta', name: 'Chocofrutas' },
    { id: 'helado', name: 'Helados' },
    { id: 'flor', name: 'Floristería' },
    // Eventos ya no vive aqui: tiene su propia pagina en /eventos. Dejarlo
    // tambien como chip era una segunda puerta a lo mismo, y la peor de las
    // dos: mostraba una quinceanera completa con la misma tarjeta que una
    // chocofruta de Q7.
  ];

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.categorySelected.emit(categoryId);
  }
}

// search-bar.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() searchChanged = new EventEmitter<string>();
  searchValue = '';

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
    this.searchChanged.emit(input.value);
  }

  clearSearch() {
    this.searchValue = '';
    this.searchChanged.emit('');
  }
}

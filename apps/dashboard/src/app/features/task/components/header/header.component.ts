import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() isDarkMode = false;
  @Input() displayName$!: Observable<string | null>;
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() openAddTaskModal = new EventEmitter<void>();
  @Output() categoryChanged = new EventEmitter<'All' | 'Work' | 'Personal' | 'Other'>();

  selectedCategory: 'All' | 'Work' | 'Personal' | 'Other' = 'All';
  searchTerm = '';
  onCategoryChange(): void {
    this.categoryChanged.emit(this.selectedCategory);
  }
}
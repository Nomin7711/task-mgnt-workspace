import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Task } from '../models/task.model';
import { selectDisplayName } from '../../../state/auth/auth.reducer';
import { TaskService } from '../task.service';
import { TaskActions } from '../../../state/task/task.actions';

interface AppState {
  auth: any; // Adjust based on your actual auth state structure
}

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-column.component.html',
})
export class TaskColumnComponent {
  @Input() title = '';
  @Input() tasks: Task[] = [];
  @Input() isDarkMode = false;
  @Input() sortOrder: 'asc' | 'desc' | undefined;
  @Input() selectedCategory: 'All' | 'Work' | 'Personal' | 'Other' = 'All';
  
  @Output() addTask = new EventEmitter<void>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() dropTask = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() sortTasks = new EventEmitter<'asc' | 'desc'>();

  private store = inject<Store<AppState>>(Store);
  displayName$ = this.store.select(selectDisplayName);

  getFilteredTasks(): Task[] {
    let filtered = this.tasks;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(task => task.category === this.selectedCategory);
    }

    if (this.sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const titleA = (a.title ?? '').toLowerCase();
        const titleB = (b.title ?? '').toLowerCase();
        if (titleA < titleB) return this.sortOrder === 'asc' ? -1 : 1;
        if (titleA > titleB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  getCategoryColorClass(category: string): { bgClass: string; textClass: string } {
    switch (category?.toLowerCase()) {
      case 'work':
        return {
          bgClass: 'bg-blue-500 dark:bg-blue-900',
          textClass: 'text-white dark:text-blue-200',
        };
      case 'personal':
        return {
          bgClass: 'bg-green-500 dark:bg-green-900',
          textClass: 'text-white dark:text-green-200',
        };
      case 'other':
        return {
          bgClass: 'bg-slate-500 dark:bg-slate-700',
          textClass: 'text-white dark:text-slate-200',
        };
      default:
        return {
          bgClass: 'bg-fuchsia-600 dark:bg-fuchsia-900',
          textClass: 'text-white dark:text-fuchsia-200',
        };
    }
  }

  toggleSort(): void {
    if (!this.sortOrder) {
      this.sortTasks.emit('asc');
    } else if (this.sortOrder === 'asc') {
      this.sortTasks.emit('desc');
    } else {
      this.sortTasks.emit(undefined);
    }
  }

    onDeleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTask({ id: task.id }));
    }
  }
  
}
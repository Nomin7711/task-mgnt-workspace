import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

interface CategoryColors {
  bgClass: string;
  textClass: string;
}

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() isDarkMode!: boolean;
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  getCategoryColorClass(category: string): CategoryColors {
    switch (category?.toLowerCase()) {
      case 'work':
        return { 
          bgClass: 'bg-blue-500 dark:bg-blue-900', 
          textClass: 'text-white dark:text-blue-200' 
        };
      case 'personal':
        return { 
          bgClass: 'bg-green-500 dark:bg-green-900', 
          textClass: 'text-white dark:text-green-200' 
        };
      case 'other':
        return { 
          bgClass: 'bg-slate-500 dark:bg-slate-700', 
          textClass: 'text-white dark:text-slate-200' 
        };
      default:
        return { 
          bgClass: 'bg-fuchsia-600 dark:bg-fuchsia-900', 
          textClass: 'text-white dark:text-fuchsia-200' 
        };
    }
  }

  getTaskColor(status: string): string {
    return ''; 
  }

  onDelete(): void {
    this.deleteTask.emit(this.task);
  }

  onEdit(): void {
    this.editTask.emit(this.task);
  }
}
import { Component, Input } from '@angular/core';

// You will need to define or import your Task interface
interface Task {
  title: string;
  category: string;
  priority: string;
  status: string;
  // ... other properties
}

interface CategoryColors {
  bgClass: string;
  textClass: string;
}

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
//   styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() isDarkMode!: boolean;

  getCategoryColorClass(category: string): CategoryColors {
    switch (category.toLowerCase()) {
        case 'work':
          return { bgClass: 'bg-blue-500 dark:bg-blue-900', textClass: 'text-white dark:text-blue-200' };
        case 'personal':
          return { bgClass: 'bg-green-500 dark:bg-green-900', textClass: 'text-white dark:text-green-200' };
        case 'other':
          return { bgClass: 'bg-slate-500 dark:bg-slate-700', textClass: 'text-white dark:text-slate-200' };
        default:
          return { bgClass: 'bg-fuchsia-600 dark:bg-fuchsia-900', textClass: 'text-white dark:text-fuchsia-200' };
      }
  }

  getTaskColor(status: string): string {
      return ''; // or implement your task color logic here
  }
}
// import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { Observable, Subscription } from 'rxjs';
// import { Task, TaskStatus, TaskCategory, TaskPriority } from '../models/task.model';
// import { TaskState } from '../../../state/task/task.reducer';
// import { TaskActions } from '../../../state/task/task.actions';
// import { AuthActions } from '../../../state/auth/auth.actions';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
// import { AddTaskComponent } from '../components/add-task/add-task.component';
// import { ModalComponent } from '../components/modal/modal.component';
// import { FormsModule } from '@angular/forms';
// import { selectUsername, selectDisplayName } from '../../../state/auth/auth.reducer';
// import { TaskBarChartComponent } from '../../task-bar-chart/task-bar-chart.component';

// interface AppState {
//   tasks: TaskState;
//   auth: any;
// }
// type CategoryColors = {
//   bgClass: string;
//   textClass: string;
// };

// @Component({
//   selector: 'app-task-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ModalComponent, AddTaskComponent, DragDropModule, TaskBarChartComponent],
//   templateUrl: './task-dashboard.component.html',
// })
// export class TaskDashboardComponent implements OnInit, OnDestroy {
//   private store = inject<Store<AppState>>(Store);
//   private subscription = new Subscription();

//   tasks$!: Observable<Task[]>;

//   searchTerm = '';
//   showChart = false;
//   isDarkMode = false;
//   showAddTaskModal = false;
//   showEditTaskModal = false;
//   selectedTask: Task | null = null;

//   todoTasks: Task[] = [];
//   inProgressTasks: Task[] = [];
//   doneTasks: Task[] = [];

//   @HostListener('window:keydown', ['$event'])
//   handleKeyboardEvent(event: KeyboardEvent) {
//     if (event.shiftKey && event.key.toLowerCase() === 'n') {
//       this.openAddTaskModal();
//       event.preventDefault(); 
//     }
//   }
//   // Sorting & Filtering
//   selectedCategory: 'All' | 'Work' | 'Personal' | 'Other' = 'All';
//   categories = ['Work', 'Personal', 'Other'];
//   todoSortOrder: 'asc' | 'desc' | undefined;
//   inProgressSortOrder: 'asc' | 'desc' | undefined;
//   doneSortOrder: 'asc' | 'desc' | undefined;

//   username$: Observable<string | null> = this.store.select(selectUsername);
//   displayName$: Observable<string | null> = this.store.select(selectDisplayName);

//   ngOnInit(): void {
//     this.store.dispatch(TaskActions.loadTasks());
//     this.tasks$ = this.store.select((state) => state.tasks.tasks);

//     this.subscription = this.tasks$.subscribe((tasks) => {
//       this.todoTasks = tasks.filter((t) => t.status === 'To Do');
//       this.inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
//       this.doneTasks = tasks.filter((t) => t.status === 'Done');
//     });

//     const saved = localStorage.getItem('darkMode');
//     this.isDarkMode = saved === 'true';
//     this.applyDarkMode();
//   }

//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//   }

//   openAddTaskModal(defaultStatus?: TaskStatus): void { 
//     const newTask: Task = {
//       id: '',
//       title: '',
//       content: '',
//       status: defaultStatus || 'To Do', 
//       category: 'Work', 
//       priority: 'Medium',
//     };
//     this.selectedTask = null; 
//     this.showAddTaskModal = true; }
//   closeAddTaskModal(): void { this.showAddTaskModal = false; }
//   openEditTaskModal(task: Task): void { 
//     console.log(this.selectedTask);
//     this.selectedTask = task; this.showEditTaskModal = true; 
// }
//   closeEditTaskModal(): void { this.selectedTask = null; this.showEditTaskModal = false; }

//   deleteTask(task: Task): void {
//     if (confirm('Are you sure you want to delete this task?')) {
//       this.store.dispatch(TaskActions.deleteTask({ id: task.id }));
//     }
//   }

//   drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
//     const movedTask = event.previousContainer.data[event.previousIndex];
//     if (!movedTask) return;
  
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       const updatedTask: Task = { ...movedTask, status: newStatus };
//       this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
  
//       transferArrayItem(
//         event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );
//     }
//   }

//   toggleDarkMode(): void {
//     this.isDarkMode = !this.isDarkMode;
//     localStorage.setItem('darkMode', this.isDarkMode.toString());
//     this.applyDarkMode();
//   }

//   private applyDarkMode(): void {
//     if (this.isDarkMode) document.documentElement.classList.add('dark');
//     else document.documentElement.classList.remove('dark');
//   }

//   logout(): void { this.store.dispatch(AuthActions.logout()); }
  
//   getCategoryColorClass(category: string): CategoryColors {
//     switch (category.toLowerCase()) {
//       case 'work':
//         return {
//           bgClass: 'bg-blue-500 dark:bg-blue-900',
//           textClass: 'text-white dark:text-blue-200',
//         };
//       case 'personal':
//         return {
//           bgClass: 'bg-green-500 dark:bg-green-900',
//           textClass: 'text-white dark:text-green-200',
//         };
//       case 'other':
//         return {
//           bgClass: 'bg-slate-500 dark:bg-slate-700',
//           textClass: 'text-white dark:text-slate-200',
//         };
//       default:
//         return {
//           bgClass: 'bg-fuchsia-600 dark:bg-fuchsia-900',
//           textClass: 'text-white dark:text-fuchsia-200',
//         };
//     }
//   }

//   sortColumn(column: 'todo' | 'inProgress' | 'done', order: 'asc' | 'desc') {
//     if (column === 'todo') this.todoSortOrder = order;
//     if (column === 'inProgress') this.inProgressSortOrder = order;
//     if (column === 'done') this.doneSortOrder = order;
//   }

//   getFilteredTasks(tasks: Task[], sortOrder?: 'asc' | 'desc'): Task[] {
//     let filtered = tasks;
  
//     if (this.selectedCategory !== 'All') {
//       filtered = filtered.filter(task => task.category === this.selectedCategory);
//     }
  
//     if (sortOrder) {
//       filtered = [...filtered].sort((a, b) => {
//         const titleA = (a.title ?? '').toLowerCase(); 
//       const titleB = (b.title ?? '').toLowerCase();
//         if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
//         if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     return filtered;
//   }
//   getSearchedTasks(tasks: Task[]): Task[] {
//     let filteredTasks = this.getFilteredTasks(tasks); 
  
//     if (this.searchTerm.trim() !== '') {
//       const term = this.searchTerm.toLowerCase();
//       filteredTasks = filteredTasks.filter(task =>
//         (task.title ?? '').toLowerCase().includes(term) ||
//         (task.content ?? '').toLowerCase().includes(term)
//       );
//     }
  
//     return filteredTasks;
//   }
  
  
 
// }
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';
import { TaskState } from '../../../state/task/task.reducer';
import { TaskActions } from '../../../state/task/task.actions';
import { AuthActions } from '../../../state/auth/auth.actions';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { TaskBoardComponent } from '../components/task-board/task-board.component';
import { ModalComponent } from '../components/modal/modal.component';
import { AddTaskComponent } from '../components/add-task/add-task.component';
import { selectDisplayName } from '../../../state/auth/auth.reducer';

interface AppState {
  tasks: TaskState;
  auth: any;
}

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    TaskBoardComponent,
    ModalComponent,
    AddTaskComponent
  ],
  templateUrl: './task-dashboard.component.html',
})
export class TaskDashboardComponent implements OnInit, OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private subscription = new Subscription();

  tasks$!: Observable<Task[]>;
  displayName$: Observable<string | null> = this.store.select(selectDisplayName);

  isDarkMode = false;
  showAddTaskModal = false;
  showEditTaskModal = false;
  selectedTask: Task | null = null;
  selectedCategory: 'All' | 'Work' | 'Personal' | 'Other' = 'All';
  onCategoryChange(category: 'All' | 'Work' | 'Personal' | 'Other'): void {
    this.selectedCategory = category;
  }

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
    this.tasks$ = this.store.select((state) => state.tasks.tasks);

    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';
    this.applyDarkMode();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAddTaskModal(status?: TaskStatus): void {
    this.showAddTaskModal = true;
  }
  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.showEditTaskModal = true;
  }

  closeEditTaskModal(): void {
    this.selectedTask = null;
    this.showEditTaskModal = false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  onAddTaskModal(status: TaskStatus): void {
    this.openAddTaskModal(status);
  }
  onEditTaskModal(task: Task): void {
    this.openEditTaskModal(task);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
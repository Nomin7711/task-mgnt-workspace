import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';
import { TaskState } from '../../../state/task/task.reducer';
import { TaskActions } from '../../../state/task/task.actions';
import { AuthActions } from '../../../state/auth/auth.actions';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../components/add-task/add-task.component';
import { ModalComponent } from '../components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { selectUsername, selectDisplayName } from '../../../state/auth/auth.reducer';
import { TaskBarChartComponent } from '../../task-bar-chart/task-bar-chart.component';

interface AppState {
  tasks: TaskState;
  auth: any;
}

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, AddTaskComponent, DragDropModule, TaskBarChartComponent],
  templateUrl: './task-dashboard.component.html',
})
export class TaskDashboardComponent implements OnInit, OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private subscription = new Subscription();

  tasks$!: Observable<Task[]>;

  showChart = false;
  isDarkMode = false;
  showAddTaskModal = false;
  showEditTaskModal = false;
  selectedTask: Task | null = null;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key.toLowerCase() === 'n') {
      this.openAddTaskModal();
      event.preventDefault(); 
    }
  }
  // Sorting & Filtering
  selectedCategory: 'All' | 'Work' | 'Personal' | 'Other' = 'All';
  categories = ['Work', 'Personal', 'Other'];
  todoSortOrder: 'asc' | 'desc' | undefined;
  inProgressSortOrder: 'asc' | 'desc' | undefined;
  doneSortOrder: 'asc' | 'desc' | undefined;

  username$: Observable<string | null> = this.store.select(selectUsername);
  displayName$: Observable<string | null> = this.store.select(selectDisplayName);

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
    this.tasks$ = this.store.select((state) => state.tasks.tasks);

    this.subscription = this.tasks$.subscribe((tasks) => {
      this.todoTasks = tasks.filter((t) => t.status === 'To Do');
      this.inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
      this.doneTasks = tasks.filter((t) => t.status === 'Done');
    });

    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';
    this.applyDarkMode();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAddTaskModal(): void { this.selectedTask = null; this.showAddTaskModal = true; }
  closeAddTaskModal(): void { this.showAddTaskModal = false; }
  openEditTaskModal(task: Task): void { 
    console.log(this.selectedTask);
    this.selectedTask = task; this.showEditTaskModal = true; 
}
  closeEditTaskModal(): void { this.selectedTask = null; this.showEditTaskModal = false; }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTask({ id: task.id }));
    }
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    const movedTask = event.previousContainer.data[event.previousIndex];
    if (!movedTask) return;
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const updatedTask: Task = { ...movedTask, status: newStatus };
      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
  
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  logout(): void { this.store.dispatch(AuthActions.logout()); }

  getTaskColor(status: string): string {
    const base = 'bg-white rounded-xl p-4 shadow-md transition transform hover:scale-[1.01]';
    switch (status) {
      case 'To Do': return `${base} border-l-4 border-blue-400`;
      case 'In Progress': return `${base} border-l-4 border-yellow-400`;
      case 'Done': return `${base} border-l-4 border-green-400`;
      default: return `${base} border-l-4 border-gray-300`;
    }
  }

  sortColumn(column: 'todo' | 'inProgress' | 'done', order: 'asc' | 'desc') {
    if (column === 'todo') this.todoSortOrder = order;
    if (column === 'inProgress') this.inProgressSortOrder = order;
    if (column === 'done') this.doneSortOrder = order;
  }

  getFilteredTasks(tasks: Task[], sortOrder?: 'asc' | 'desc'): Task[] {
    let filtered = tasks;
  
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(task => task.category === this.selectedCategory);
    }
  
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const titleA = (a.title ?? '').toLowerCase(); 
      const titleB = (b.title ?? '').toLowerCase();
        if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
        if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  
    return filtered;
  }
  
 
}

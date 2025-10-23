import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskState } from '../../../../state/task/task.reducer';
import { TaskActions } from '../../../../state/task/task.actions';
import { TaskColumnComponent } from '../../task-column/task-column.component';
import { TaskBarChartComponent } from '../../../task-bar-chart/task-bar-chart.component';

interface AppState {
  tasks: TaskState;
}

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskColumnComponent, TaskBarChartComponent],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private subscription = new Subscription();

  @Input() isDarkMode = false;
  @Output() openAddTaskModal = new EventEmitter<TaskStatus>();
  @Output() openEditTaskModal = new EventEmitter<Task>();

  tasks$!: Observable<Task[]>;
  showChart = false;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  // Sorting & Filtering
  selectedCategory: 'All' | 'Work' | 'Personal' | 'Other' = 'All';
  todoSortOrder: 'asc' | 'desc' | undefined;
  inProgressSortOrder: 'asc' | 'desc' | undefined;
  doneSortOrder: 'asc' | 'desc' | undefined;

  ngOnInit(): void {
    this.tasks$ = this.store.select((state) => state.tasks.tasks);

    this.subscription = this.tasks$.subscribe((tasks) => {
      this.todoTasks = tasks.filter((t) => t.status === 'To Do');
      this.inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
      this.doneTasks = tasks.filter((t) => t.status === 'Done');
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    const movedTask = event.previousContainer.data[event.previousIndex];
    if (!movedTask) return;

    if (event.previousContainer === event.container) {
      // Reorder within same column
      // You might want to implement reordering logic here
    } else {
      // Move to different column
      const updatedTask: Task = { ...movedTask, status: newStatus };
      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
    }
  }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTask({ id: task.id }));
    }
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
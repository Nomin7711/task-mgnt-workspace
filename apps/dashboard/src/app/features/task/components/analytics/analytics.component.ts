import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskState } from '../../../../state/task/task.reducer';
import { TaskActions } from '../../../../state/task/task.actions';
import { AuthActions } from '../../../../state/auth/auth.actions';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TaskBarChartComponent } from '../../../task-bar-chart/task-bar-chart.component';
import { selectDisplayName } from '../../../../state/auth/auth.reducer';

interface AppState {
  tasks: TaskState;
  auth: any;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TaskBarChartComponent
  ],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private store = inject<Store<AppState>>(Store);
  private subscription = new Subscription();

  tasks$!: Observable<Task[]>;
  displayName$: Observable<string | null> = this.store.select(selectDisplayName);

  isDarkMode = false;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
    this.tasks$ = this.store.select((state) => state.tasks.tasks);

    this.subscription.add(
      this.tasks$.subscribe((tasks) => {
        this.todoTasks = tasks.filter((t) => t.status === 'To Do');
        this.inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
        this.doneTasks = tasks.filter((t) => t.status === 'Done');
      })
    );

    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';
    this.applyDarkMode();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  getPriorityStats(): { name: string; count: number }[] {
    const allTasks = [...this.todoTasks, ...this.inProgressTasks, ...this.doneTasks];
    
    const priorityCounts = allTasks.reduce((acc, task) => {
      const priority = task.priority || 'Medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  
    return [
      { name: 'High', count: priorityCounts['High'] || 0 },
      { name: 'Medium', count: priorityCounts['Medium'] || 0 },
      { name: 'Low', count: priorityCounts['Low'] || 0 },
    ];
  }
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
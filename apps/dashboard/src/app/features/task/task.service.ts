import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskFilter } from './models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/api/tasks';

  // Get all tasks with optional filters
  getTasks(filter?: TaskFilter): Observable<Task[]> {
    const params: any = {};
    return this.http.get<Task[]>(this.BASE_URL, { params });
  }

  // Get single task
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.BASE_URL}/${id}`);
  }

  // Create a new task
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.BASE_URL, task);
  }

  // Update task
  updateTask(task: Task): Observable<Task> {
    const { id, ...updates } = task;
    return this.http.put<Task>(`${this.BASE_URL}/${id}`, updates);
  }

  // Delete task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}

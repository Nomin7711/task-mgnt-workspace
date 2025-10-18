import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskActions } from './task.actions';
import { TaskService } from '../../features/task/task.service';
import { Task } from '../../features/task/models/task.model';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  // === READ (Load Tasks) ===
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          map((tasks: Task[]) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) => {
            console.error('Error loading tasks:', error);
            return of(
              TaskActions.loadTasksFailure({
                error: 'Failed to retrieve tasks from server.',
              })
            );
          })
        )
      )
    )
  );

  // === CREATE (Add Task) ===
  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      switchMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((createdTask: Task) => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError((error) =>
            of(TaskActions.createTaskFailure({ error: error?.message || 'Failed to create task' }))
          )
        )
      )
    )
  );

  // === UPDATE (Edit/Reorder Task) ===
  
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      // task structure is Task, including the ID
      switchMap(({ task }) => 
        this.taskService.updateTask(task).pipe(
          map((updatedTask: Task) =>
            TaskActions.updateTaskSuccess({ task: updatedTask })
          ),
          catchError((error) => {
            console.error('Error updating task:', error);
            return of(
              TaskActions.updateTaskFailure({
                error: 'Failed to update task.',
              })
            );
          })
        )
      )
    )
  );

  // === DELETE (Remove Task) ===
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          // On success, we just need the ID to remove the task from the local store
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) => {
            console.error('Error deleting task:', error);
            return of(
              TaskActions.deleteTaskFailure({
                error: 'Failed to delete task.',
              })
            );
          })
        )
      )
    )
  );
}
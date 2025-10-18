import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task, TaskFilter } from '../../features/task/models/task.model';

/**
 * Defines all actions related to Task Management.
 */
export const TaskActions = createActionGroup({
  source: 'Task API/UI',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    'Create Task': props<{ task: Omit<Task, 'id'> }>(), 
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Failure': props<{ error: string }>(),

    'Update Task': props<{ task: Task }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Failure': props<{ error: string }>(),

    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),

    'Set Filter': props<{ filter: TaskFilter }>(),
    'Set Sort By': props<{ sortBy: TaskFilter['sortBy'] }>(),
    'Set Category': props<{ category: TaskFilter['category'] }>(), 
  },
});
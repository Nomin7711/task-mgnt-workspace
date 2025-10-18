import { createReducer, on } from '@ngrx/store';
import { Task, TaskFilter } from '../../features/task/models/task.model';
import { TaskActions } from './task.actions';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: {
    category: 'All',
    priority: 'All',
    sortBy: 'createdAt',
    sortDirection: 'desc',
  },
};

export const taskReducer = createReducer(
  initialState,

  // === LOAD TASKS ===
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks,
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === CREATE TASK ===
  on(TaskActions.createTask, (state) => ({
    ...state,
    loading: true,
  })),
  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    tasks: [...state.tasks, task],
  })),
  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === UPDATE TASK ===
  on(TaskActions.updateTask, (state) => ({
    ...state,
    loading: true,
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    error: null,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === DELETE TASK ===
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    loading: true,
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === FILTERS & SORTING ===
  on(TaskActions.setFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter },
  })),
  on(TaskActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    filter: { ...state.filter, sortBy },
  })),
  on(TaskActions.setCategory, (state, { category }) => ({
    ...state,
    filter: { ...state.filter, category },
  }))
);

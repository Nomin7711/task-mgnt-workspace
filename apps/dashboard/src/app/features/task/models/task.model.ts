export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskCategory = 'Work' | 'Personal' | 'Other';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
}
  export interface TaskFilter {
    category?: 'Work' | 'Personal' | 'Other' | 'All';
    priority?: 'High' | 'Medium' | 'Low' | 'All';
    sortBy?: 'createdAt' | 'priority';
    sortDirection?: 'asc' | 'desc';
  }
  
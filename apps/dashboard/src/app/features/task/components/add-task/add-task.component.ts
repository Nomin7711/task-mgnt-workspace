import { Component, OnInit, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TaskActions } from '../../../../state/task/task.actions';
import { TaskState } from '../../../../state/task/task.reducer';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
})
export class AddTaskComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private store = inject<Store<{ tasks: TaskState }>>(Store);

  @Input() task: Task | null = null; // null means creating a new task
  @Output() closeModal = new EventEmitter<void>();

  taskForm!: FormGroup;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  taskStatuses = ['To Do', 'In Progress', 'Done'];
  taskCategories = ['Work', 'Personal', 'Other'];
  taskPriorities = ['High', 'Medium', 'Low'];

  ngOnInit(): void {
    this.initForm();
    this.loading$ = this.store.select((state) => state.tasks.loading);
    this.error$ = this.store.select((state) => state.tasks.error);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      content: [this.task?.content || '', Validators.required],
      category: [this.task?.category || this.taskCategories[0], Validators.required],
      status: [this.task?.status || this.taskStatuses[0], Validators.required],
      priority: [this.task?.priority || this.taskPriorities[1], Validators.required],
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;

    if (this.task) {
      // Editing existing task
      const updatedTask: Task = {
        ...this.task,
        ...formValue,
      };
      
      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
    } else {
      // Creating new task
      const newTask: Omit<Task, 'id' | 'userId' | 'updatedAt'> = {
        ...formValue,
      };
      this.store.dispatch(TaskActions.createTask({ task: newTask }));
    }

    this.closeModal.emit();
  }
}

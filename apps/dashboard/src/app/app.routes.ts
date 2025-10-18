import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { TaskDashboardComponent } from './features/task/task-dashboard/task-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'tasks',
    component: TaskDashboardComponent,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'login' },
];
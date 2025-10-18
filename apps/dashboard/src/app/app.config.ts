import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects'; 
import { authReducer } from './state/auth/auth.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthEffects } from './state/auth/auth.effects';
import { taskReducer } from './state/task/task.reducer';
import { TaskEffects } from './state/task/task.effect';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      auth: authReducer,
      tasks: taskReducer,
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideEffects([AuthEffects, TaskEffects]), 
  ],
};

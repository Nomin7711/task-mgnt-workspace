import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthService } from '../../features/auth/auth.service';
import { AuthResponse } from '../../features/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Effect to handle the Login Attempt action
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginAttempt),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response: AuthResponse) => {
            // Success: Extract user details and token
            return AuthActions.loginSuccess({
              token: response.access_token,
              username: response.user.username,
              roles: response.user.roles,
              displayName: response.user.displayName,
            });
          }),
          catchError((error) => {
            // Failure: Dispatch failure action with error message
            const errorMessage = error.error?.message || 'Login failed. Check credentials.';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );


  // Effect to handle success: save token and navigate
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          localStorage.setItem('jwt_token', token);
          console.log('Token stored : ' , token);
          const saved = localStorage.getItem('jwt_token');
          if (saved) {
            this.router.navigate(['/tasks']);
          } else {
            console.error('❌ Token not found after save');
          }
          // Navigate to the dashboard upon successful login
          // this.router.navigate(['/tasks']); 
        })
      ),
    { dispatch: false } // This effect does not dispatch a new action
  );

  // Effect to handle Logout: clear token and navigate
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('jwt_token');
          // Navigate back to the login screen
          this.router.navigate(['/login']); 
        })
      ),
    { dispatch: false }
  );
}
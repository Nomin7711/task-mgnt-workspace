// src/app/features/auth/login/login.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../state/auth/auth.actions';
import { authFeature } from '../../../state/auth/auth.reducer';
import { Router } from '@angular/router';
import { selectIsAuthenticated } from '../../../state/auth/auth.reducer';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  loginForm!: FormGroup;
  
  loading$ = this.store.select(authFeature.selectLoading);
  error$ = this.store.select(authFeature.selectError);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.isAuthenticated$.subscribe(isAuthenticated => {
        if (isAuthenticated) {
            this.router.navigate(['/tasks']);
        }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.store.dispatch(AuthActions.loginAttempt({ username, password }));
    }
  }
}
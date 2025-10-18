import { createFeature, createReducer, on, createSelector } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  token: string | null;
  username: string | null;
  roles: string[] | null;
  displayName: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: localStorage.getItem('jwt_token') || null,
  username: null,
  roles: null,
  displayName: null,
  isAuthenticated: !!localStorage.getItem('jwt_token'),
  loading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    on(AuthActions.loginAttempt, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(AuthActions.loginSuccess, (state, { token, username, roles, displayName }) => ({
      ...state,
      token,
      username,
      roles,
      displayName,
      isAuthenticated: true,
      loading: false,
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      token: null,
      username: null,
      roles: null,
      displayName: null,
      isAuthenticated: false,
      loading: false,
      error,
    })),

    on(AuthActions.logout, () => ({
      ...initialState,
      token: null,
      isAuthenticated: false,
    }))
  ),
});

// ✅ destructure properly
export const authReducer = authFeature.reducer;
export const selectAuthState = authFeature.selectAuthState;
export const selectIsAuthenticated = authFeature.selectIsAuthenticated;
export const selectToken = authFeature.selectToken;

// custom selectors
export const selectUsername = createSelector(selectAuthState, (state) => state.username);
export const selectDisplayName = createSelector(selectAuthState, (state) => state.displayName);
export const selectRoles = createSelector(selectAuthState, (state) => state.roles);
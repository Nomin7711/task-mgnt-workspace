import { createActionGroup, emptyProps, props} from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Attempt': props<{ username: string; password: string }>(),

    'Login Success': props<{ 
      token: string; 
      username: string; 
      roles: string[];
      displayName: string 
    }>(),

    'Login Failure': props<{ error: string }>(),

    'Logout': emptyProps(),
  },
});
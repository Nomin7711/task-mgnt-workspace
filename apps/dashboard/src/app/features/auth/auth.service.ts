import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDetails {
  id: number;
  username: string;
  displayName: string;
  roles: string[]; 
}
export interface AuthResponse {
  access_token: string;
  user: UserDetails;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly LOGIN_URL = 'http://localhost:3000/api/auth/login'; 

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.LOGIN_URL, { username, password });
  }
}
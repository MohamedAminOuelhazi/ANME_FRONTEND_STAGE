import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token'; // Doit correspondre à celui utilisé dans AuthComponent
  private readonly ROLE_KEY = 'role';

  constructor() { }

  getRole(): string {
    return localStorage.getItem(this.ROLE_KEY) ?? '';
  }

  setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

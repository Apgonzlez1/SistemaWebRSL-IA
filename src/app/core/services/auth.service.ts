import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  // Credenciales de demostración
  private readonly DEMO_CREDENTIALS = {
    email: 'investigador@universidad.edu',
    password: 'RevisionSistematica2024'
  };

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): boolean {
    if (email === this.DEMO_CREDENTIALS.email && password === this.DEMO_CREDENTIALS.password) {
      const user: User = {
        id: '1',
        email: email,
        name: 'Dr. María González',
        role: 'Investigador Principal'
      };
      
      this.currentUserSignal.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Safe to access localStorage
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          this.currentUserSignal.set(parsedUser);
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
    } else {
      // SSR: localStorage not available
      // Handle accordingly (e.g., do nothing or log)
    }
  }
}
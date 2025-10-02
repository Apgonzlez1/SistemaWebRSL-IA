import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-content">
        <div class="login-left">
          <div class="login-header">
            <div class="logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <h1>SysReview AI</h1>
            </div>
            <p class="subtitle">Sistema de Gestión de Revisiones Sistemáticas con IA</p>
          </div>

          <form (ngSubmit)="handleLogin()" class="login-form">
            <div class="form-group">
              <label class="label" for="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                class="input"
                placeholder="investigador@universidad.edu"
                required
              />
            </div>

            <div class="form-group">
              <label class="label" for="password">Contraseña</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                class="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div *ngIf="error()" class="error-message">
              {{ error() }}
            </div>

            <button type="submit" class="btn btn-primary login-btn" [disabled]="loading()">
              <span *ngIf="loading()" class="spinner"></span>
              <span>{{ loading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
            </button>
          </form>

          <div class="demo-credentials">
            <p class="demo-title">Credenciales de Demostración:</p>
            <div class="demo-info">
              <p><strong>Email:</strong> investigador&#64;universidad.edu</p>
              <p><strong>Contraseña:</strong> RevisionSistematica2024</p>
            </div>
          </div>
        </div>

        <div class="login-right">
          <div class="feature-card">
            <div class="feature-icon module1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h3>Módulo 1</h3>
            <p>Gestión del Proceso de Revisión y Cribado de Estudios</p>
            <ul>
              <li>Importación y organización de estudios</li>
              <li>Cribado sistemático por título y abstract</li>
              <li>Filtros avanzados y búsqueda inteligente</li>
              <li>Seguimiento de progreso en tiempo real</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon module2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Módulo 2</h3>
            <p>Flujo de Trabajo Guiado por IA para Validación PRISMA</p>
            <ul>
              <li>Validación automatizada de ítems PRISMA</li>
              <li>Sugerencias inteligentes basadas en IA</li>
              <li>Análisis de completitud y calidad</li>
              <li>Generación de reportes automáticos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'investigador@universidad.edu';
  password = 'RevisionSistematica2024';
  loading = signal(false);
  error = signal('');

  handleLogin(): void {
    this.error.set('');
    this.loading.set(true);

    setTimeout(() => {
      const success = this.authService.login(this.email, this.password);
      
      if (!success) {
        this.error.set('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      }
      
      this.loading.set(false);
    }, 800);
  }
}
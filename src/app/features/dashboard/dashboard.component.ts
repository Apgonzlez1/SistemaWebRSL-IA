import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { Project } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent, CardComponent],
  template: `
    <div class="dashboard-layout">
      <app-navigation></app-navigation>
      
      <main class="dashboard-main">
        <div class="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p class="subtitle">Resumen de tus proyectos de revisión sistemática</p>
          </div>
          <button class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Proyecto
          </button>
        </div>

        <div class="stats-grid">
          <app-card>
            <div class="stat-card">
              <div class="stat-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="stat-content">
                <p class="stat-label">Proyectos Activos</p>
                <p class="stat-value">{{ stats().activeProjects }}</p>
              </div>
            </div>
          </app-card>

          <app-card>
            <div class="stat-card">
              <div class="stat-icon accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div class="stat-content">
                <p class="stat-label">Estudios Totales</p>
                <p class="stat-value">{{ stats().totalStudies }}</p>
              </div>
            </div>
          </app-card>

          <app-card>
            <div class="stat-card">
              <div class="stat-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div class="stat-content">
                <p class="stat-label">Estudios Incluidos</p>
                <p class="stat-value">{{ stats().includedStudies }}</p>
              </div>
            </div>
          </app-card>

          <app-card>
            <div class="stat-card">
              <div class="stat-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div class="stat-content">
                <p class="stat-label">Progreso PRISMA</p>
                <p class="stat-value">{{ stats().prismaProgress }}%</p>
              </div>
            </div>
          </app-card>
        </div>

        <div class="projects-section">
          <h2>Proyectos Recientes</h2>
          <div class="projects-grid">
            <app-card [hover]="true" *ngFor="let project of projects()">
              <div class="project-card">
                <div class="project-header">
                  <h3>{{ project.name }}</h3>
                  <span class="badge badge-primary">Activo</span>
                </div>
                <p class="project-description">{{ project.description }}</p>
                
                <div class="project-stats">
                  <div class="project-stat">
                    <span class="stat-number">{{ project.totalStudies }}</span>
                    <span class="stat-text">Estudios</span>
                  </div>
                  <div class="project-stat">
                    <span class="stat-number">{{ project.screenedStudies }}</span>
                    <span class="stat-text">Cribados</span>
                  </div>
                  <div class="project-stat">
                    <span class="stat-number">{{ project.includedStudies }}</span>
                    <span class="stat-text">Incluidos</span>
                  </div>
                </div>

                <div class="progress-section">
                  <div class="progress-header">
                    <span class="progress-label">Progreso General</span>
                    <span class="progress-value">{{ getProgressPercentage(project) }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="getProgressPercentage(project)"></div>
                  </div>
                </div>

                <div class="project-footer">
                  <span class="project-date">Actualizado {{ getRelativeTime(project.updatedAt) }}</span>
                  <a routerLink="/studies" class="btn btn-outline btn-sm">
                    Ver Detalles
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </app-card>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  stats = signal({
    activeProjects: 3,
    totalStudies: 1247,
    includedStudies: 89,
    prismaProgress: 67
  });

  projects = signal<Project[]>([
    {
      id: '1',
      name: 'Efectividad de Intervenciones en Salud Mental',
      description: 'Revisión sistemática sobre intervenciones psicológicas para trastornos de ansiedad en población adulta.',
      totalStudies: 456,
      screenedStudies: 320,
      includedStudies: 45,
      excludedStudies: 275,
      prismaProgress: 75,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: '2',
      name: 'Tecnologías Educativas en Aprendizaje',
      description: 'Análisis de la efectividad de plataformas digitales en educación superior.',
      totalStudies: 523,
      screenedStudies: 412,
      includedStudies: 32,
      excludedStudies: 380,
      prismaProgress: 60,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-02-08')
    },
    {
      id: '3',
      name: 'Cambio Climático y Biodiversidad',
      description: 'Impacto del cambio climático en ecosistemas marinos costeros.',
      totalStudies: 268,
      screenedStudies: 180,
      includedStudies: 12,
      excludedStudies: 168,
      prismaProgress: 45,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-09')
    }
  ]);

  getProgressPercentage(project: Project): number {
    if (project.totalStudies === 0) return 0;
    return Math.round((project.screenedStudies / project.totalStudies) * 100);
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    if (days < 7) return `hace ${days} días`;
    if (days < 30) return `hace ${Math.floor(days / 7)} semanas`;
    return `hace ${Math.floor(days / 30)} meses`;
  }
}
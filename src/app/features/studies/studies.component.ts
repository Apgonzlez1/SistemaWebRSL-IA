import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { Study } from '../../core/models/user.model';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, CardComponent],
  template: `
    <div class="studies-layout">
      <app-navigation></app-navigation>
      
      <main class="studies-main">
        <div class="studies-header">
          <div>
            <h1>Módulo 1: Gestión de Estudios</h1>
            <p class="subtitle">Proceso de revisión y cribado sistemático</p>
          </div>
          <button class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Importar Estudios
          </button>
        </div>

        <div class="filters-section">
          <app-card>
            <div class="filters-content">
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearchChange()"
                  placeholder="Buscar por título, autor o palabras clave..."
                  class="search-input"
                />
              </div>

              <div class="filter-buttons">
                <button
                  *ngFor="let status of statusFilters"
                  (click)="toggleStatusFilter(status.value)"
                  [class.active]="selectedStatus() === status.value"
                  class="filter-btn"
                >
                  {{ status.label }}
                  <span class="filter-count">{{ getCountByStatus(status.value) }}</span>
                </button>
              </div>
            </div>
          </app-card>
        </div>

        <div class="studies-stats">
          <div class="stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">{{ filteredStudies().length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Pendientes</span>
            <span class="stat-value pending">{{ getCountByStatus('pending') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">En Revisión</span>
            <span class="stat-value screening">{{ getCountByStatus('screening') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Incluidos</span>
            <span class="stat-value included">{{ getCountByStatus('included') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Excluidos</span>
            <span class="stat-value excluded">{{ getCountByStatus('excluded') }}</span>
          </div>
        </div>

        <div class="studies-list">
          <app-card *ngFor="let study of filteredStudies()" [hover]="true">
            <div class="study-item">
              <div class="study-header">
                <div class="study-title-section">
                  <h3>{{ study.title }}</h3>
                  <div class="study-meta">
                    <span class="meta-item">{{ study.authors }}</span>
                    <span class="meta-separator">•</span>
                    <span class="meta-item">{{ study.year }}</span>
                    <span class="meta-separator">•</span>
                    <span class="meta-item">{{ study.source }}</span>
                  </div>
                </div>
                <div class="study-actions">
                  <span [class]="'badge badge-' + getStatusClass(study.status)">
                    {{ getStatusLabel(study.status) }}
                  </span>
                  <div *ngIf="study.relevanceScore" class="relevance-score">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>{{ study.relevanceScore }}%</span>
                  </div>
                </div>
              </div>

              <p class="study-abstract">{{ study.abstract }}</p>

              <div class="study-footer">
                <div class="action-buttons">
                  <button
                    (click)="updateStudyStatus(study, 'included')"
                    [disabled]="study.status === 'included'"
                    class="btn btn-sm btn-outline success"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Incluir
                  </button>
                  <button
                    (click)="updateStudyStatus(study, 'screening')"
                    [disabled]="study.status === 'screening'"
                    class="btn btn-sm btn-outline"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Revisar
                  </button>
                  <button
                    (click)="updateStudyStatus(study, 'excluded')"
                    [disabled]="study.status === 'excluded'"
                    class="btn btn-sm btn-outline danger"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Excluir
                  </button>
                </div>
                <button class="btn btn-sm btn-secondary">
                  Ver Detalles
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          </app-card>

          <div *ngIf="filteredStudies().length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No se encontraron estudios</h3>
            <p>Intenta ajustar los filtros o la búsqueda</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./studies.component.css']
})
export class StudiesComponent {
  searchQuery = '';
  selectedStatus = signal<string>('all');

  statusFilters = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'En Revisión', value: 'screening' },
    { label: 'Incluidos', value: 'included' },
    { label: 'Excluidos', value: 'excluded' }
  ];

  studies = signal<Study[]>([
    {
      id: '1',
      title: 'Cognitive Behavioral Therapy for Anxiety Disorders: A Meta-Analysis',
      authors: 'Smith, J., Johnson, M., Williams, K.',
      year: 2023,
      status: 'pending',
      source: 'PubMed',
      abstract: 'This meta-analysis examines the effectiveness of cognitive behavioral therapy (CBT) in treating various anxiety disorders. Results from 45 randomized controlled trials indicate significant improvements in anxiety symptoms...',
      relevanceScore: 92
    },
    {
      id: '2',
      title: 'Digital Learning Platforms in Higher Education: A Systematic Review',
      authors: 'García, A., Rodríguez, L.',
      year: 2023,
      status: 'screening',
      source: 'Scopus',
      abstract: 'This systematic review analyzes the implementation and effectiveness of digital learning platforms in higher education institutions. The study includes 67 peer-reviewed articles published between 2018 and 2023...',
      relevanceScore: 88
    },
    {
      id: '3',
      title: 'Climate Change Impact on Marine Biodiversity: A Comprehensive Analysis',
      authors: 'Chen, L., Anderson, P., Martinez, R.',
      year: 2022,
      status: 'included',
      source: 'Web of Science',
      abstract: 'This comprehensive analysis investigates the effects of climate change on marine ecosystems and biodiversity. Data from 120 coastal regions worldwide reveal significant shifts in species distribution...',
      relevanceScore: 95
    },
    {
      id: '4',
      title: 'Mindfulness-Based Interventions for Stress Reduction: A Clinical Trial',
      authors: 'Brown, T., Davis, S.',
      year: 2023,
      status: 'pending',
      source: 'PsycINFO',
      abstract: 'This randomized clinical trial evaluates the efficacy of mindfulness-based interventions in reducing stress levels among working professionals. Participants (n=200) were randomly assigned to intervention or control groups...',
      relevanceScore: 85
    },
    {
      id: '5',
      title: 'Artificial Intelligence in Medical Diagnosis: Current State and Future Prospects',
      authors: 'Lee, H., Kim, J., Park, S.',
      year: 2023,
      status: 'screening',
      source: 'IEEE Xplore',
      abstract: 'This review examines the current applications of artificial intelligence in medical diagnosis, focusing on machine learning algorithms for image analysis and disease prediction. The study covers developments from 2020 to 2023...',
      relevanceScore: 90
    },
    {
      id: '6',
      title: 'Social Media Use and Mental Health in Adolescents: A Longitudinal Study',
      authors: 'Wilson, E., Thompson, M.',
      year: 2022,
      status: 'excluded',
      source: 'PubMed',
      abstract: 'This longitudinal study investigates the relationship between social media use and mental health outcomes in adolescents over a 3-year period. Results suggest complex interactions between usage patterns and psychological well-being...',
      relevanceScore: 78
    }
  ]);

  filteredStudies = computed(() => {
    let filtered = this.studies();

    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(s => s.status === this.selectedStatus());
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.authors.toLowerCase().includes(query) ||
        s.abstract.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  toggleStatusFilter(status: string): void {
    this.selectedStatus.set(status);
  }

  getCountByStatus(status: string): number {
    if (status === 'all') return this.studies().length;
    return this.studies().filter(s => s.status === status).length;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      screening: 'En Revisión',
      included: 'Incluido',
      excluded: 'Excluido'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'secondary',
      screening: 'warning',
      included: 'success',
      excluded: 'secondary'
    };
    return classes[status] || 'secondary';
  }

  updateStudyStatus(study: Study, newStatus: Study['status']): void {
    const updatedStudies = this.studies().map(s =>
      s.id === study.id ? { ...s, status: newStatus } : s
    );
    this.studies.set(updatedStudies);
  }

  onSearchChange(): void {
    // Trigger computed signal update
  }
}
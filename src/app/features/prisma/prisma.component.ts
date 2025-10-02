import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PrismaItem } from '../../core/models/user.model';

@Component({
  selector: 'app-prisma',
  standalone: true,
  imports: [CommonModule, NavigationComponent, CardComponent],
  template: `
    <div class="prisma-layout">
      <app-navigation></app-navigation>
      
      <main class="prisma-main">
        <div class="prisma-header">
          <div>
            <h1>Módulo 2: Validación PRISMA</h1>
            <p class="subtitle">Flujo de trabajo guiado por IA para validación secuencial</p>
          </div>
          <button class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Generar Reporte
          </button>
        </div>

        <div class="progress-overview">
          <app-card>
            <div class="progress-content">
              <div class="progress-info">
                <h3>Progreso General PRISMA</h3>
                <p>{{ getCompletedItems() }} de {{ prismaItems().length }} ítems completados</p>
              </div>
              <div class="progress-circle">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgb(var(--secondary))"
                    stroke-width="12"
                  ></circle>
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgb(var(--primary))"
                    stroke-width="12"
                    [attr.stroke-dasharray]="getCircumference()"
                    [attr.stroke-dashoffset]="getProgressOffset()"
                    stroke-linecap="round"
                    transform="rotate(-90 60 60)"
                  ></circle>
                  <text
                    x="60"
                    y="60"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="24"
                    font-weight="700"
                    fill="rgb(var(--foreground))"
                  >
                    {{ getProgressPercentage() }}%
                  </text>
                </svg>
              </div>
            </div>
          </app-card>
        </div>

        <div class="prisma-sections">
          <div *ngFor="let section of getSections()" class="section-group">
            <h2 class="section-title">{{ section }}</h2>
            
            <div class="items-list">
              <app-card *ngFor="let item of getItemsBySection(section)" [hover]="true">
                <div class="prisma-item">
                  <div class="item-header">
                    <div class="item-number">{{ item.item }}</div>
                    <div class="item-status-badge">
                      <span [class]="'badge badge-' + getStatusClass(item.status)">
                        {{ getStatusLabel(item.status) }}
                      </span>
                      <div *ngIf="item.aiScore" class="ai-score">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <span>IA: {{ item.aiScore }}%</span>
                      </div>
                    </div>
                  </div>

                  <p class="item-description">{{ item.description }}</p>

                  <div *ngIf="item.aiSuggestions && item.aiSuggestions.length > 0" class="ai-suggestions">
                    <div class="suggestions-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span>Sugerencias de IA</span>
                    </div>
                    <ul class="suggestions-list">
                      <li *ngFor="let suggestion of item.aiSuggestions">{{ suggestion }}</li>
                    </ul>
                  </div>

                  <div class="item-actions">
                    <button
                      (click)="updateItemStatus(item, 'completed')"
                      [disabled]="item.status === 'completed'"
                      class="btn btn-sm btn-primary"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Marcar Completo
                    </button>
                    <button
                      (click)="updateItemStatus(item, 'in-progress')"
                      [disabled]="item.status === 'in-progress'"
                      class="btn btn-sm btn-outline"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      En Progreso
                    </button>
                    <button
                      (click)="updateItemStatus(item, 'needs-review')"
                      [disabled]="item.status === 'needs-review'"
                      class="btn btn-sm btn-outline"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      Necesita Revisión
                    </button>
                    <button class="btn btn-sm btn-secondary">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </app-card>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./prisma.component.css']
})
export class PrismaComponent {
  prismaItems = signal<PrismaItem[]>([
    {
      id: '1',
      section: 'Título',
      item: '1',
      description: 'Identificar el informe como una revisión sistemática, metaanálisis o ambos.',
      status: 'completed',
      aiScore: 95,
      aiSuggestions: [
        'El título actual cumple con los requisitos PRISMA',
        'Se recomienda incluir el término "revisión sistemática" explícitamente'
      ]
    },
    {
      id: '2',
      section: 'Resumen',
      item: '2',
      description: 'Proporcionar un resumen estructurado que incluya antecedentes, objetivos, fuentes de datos, criterios de elegibilidad, participantes, intervenciones, evaluación de estudios, métodos de síntesis, resultados, limitaciones, conclusiones e implicaciones.',
      status: 'completed',
      aiScore: 88,
      aiSuggestions: [
        'El resumen incluye la mayoría de los elementos requeridos',
        'Considere agregar más detalles sobre las limitaciones del estudio'
      ]
    },
    {
      id: '3',
      section: 'Introducción - Justificación',
      item: '3',
      description: 'Describir la justificación de la revisión en el contexto del conocimiento existente.',
      status: 'in-progress',
      aiScore: 82,
      aiSuggestions: [
        'La justificación está bien fundamentada',
        'Se sugiere incluir referencias más recientes (últimos 2 años)',
        'Considere expandir la discusión sobre las brechas en la literatura'
      ]
    },
    {
      id: '4',
      section: 'Introducción - Objetivos',
      item: '4',
      description: 'Proporcionar una declaración explícita de las preguntas que se abordan con referencia a participantes, intervenciones, comparaciones, resultados y diseño de estudio (PICOS).',
      status: 'in-progress',
      aiScore: 90,
      aiSuggestions: [
        'Los objetivos están claramente definidos usando el formato PICOS',
        'Excelente especificación de criterios de inclusión y exclusión'
      ]
    },
    {
      id: '5',
      section: 'Métodos - Protocolo y registro',
      item: '5',
      description: 'Indicar si existe un protocolo de revisión, si y dónde se puede acceder (por ejemplo, dirección web), y, si está disponible, proporcionar información de registro incluyendo número de registro.',
      status: 'needs-review',
      aiScore: 75,
      aiSuggestions: [
        'Se menciona el protocolo pero falta el número de registro',
        'Recomendación: Incluir el enlace directo al protocolo registrado',
        'Verificar que el protocolo esté públicamente accesible'
      ]
    },
    {
      id: '6',
      section: 'Métodos - Criterios de elegibilidad',
      item: '6',
      description: 'Especificar características del estudio (por ejemplo, PICOS, duración del seguimiento) y características del informe (por ejemplo, años considerados, idioma, estado de publicación) utilizadas como criterios de elegibilidad, dando justificación.',
      status: 'pending',
      aiScore: 70,
      aiSuggestions: [
        'Los criterios de elegibilidad necesitan más especificidad',
        'Incluir justificación para las restricciones de idioma',
        'Especificar el rango de fechas de publicación considerado'
      ]
    },
    {
      id: '7',
      section: 'Métodos - Fuentes de información',
      item: '7',
      description: 'Describir todas las fuentes de información (por ejemplo, bases de datos con fechas de cobertura, contacto con autores de estudios para identificar estudios adicionales) en la búsqueda y fecha de última búsqueda.',
      status: 'pending',
      aiScore: 85,
      aiSuggestions: [
        'Buena cobertura de bases de datos principales',
        'Considere incluir búsqueda en literatura gris',
        'Especificar las fechas exactas de cada búsqueda'
      ]
    },
    {
      id: '8',
      section: 'Métodos - Búsqueda',
      item: '8',
      description: 'Presentar la estrategia de búsqueda electrónica completa para al menos una base de datos, incluyendo los límites utilizados, de modo que pueda ser repetida.',
      status: 'pending',
      aiScore: 78,
      aiSuggestions: [
        'La estrategia de búsqueda está bien estructurada',
        'Incluir la estrategia completa como material suplementario',
        'Documentar todos los operadores booleanos y filtros utilizados'
      ]
    }
  ]);

  getSections(): string[] {
    const sections = new Set(this.prismaItems().map(item => item.section));
    return Array.from(sections);
  }

  getItemsBySection(section: string): PrismaItem[] {
    return this.prismaItems().filter(item => item.section === section);
  }

  getCompletedItems(): number {
    return this.prismaItems().filter(item => item.status === 'completed').length;
  }

  getProgressPercentage(): number {
    const total = this.prismaItems().length;
    const completed = this.getCompletedItems();
    return Math.round((completed / total) * 100);
  }

  getCircumference(): number {
    return 2 * Math.PI * 54;
  }

  getProgressOffset(): number {
    const circumference = this.getCircumference();
    const progress = this.getProgressPercentage();
    return circumference - (progress / 100) * circumference;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      'in-progress': 'En Progreso',
      completed: 'Completado',
      'needs-review': 'Necesita Revisión'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'secondary',
      'in-progress': 'warning',
      completed: 'success',
      'needs-review': 'warning'
    };
    return classes[status] || 'secondary';
  }

  updateItemStatus(item: PrismaItem, newStatus: PrismaItem['status']): void {
    const updatedItems = this.prismaItems().map(i =>
      i.id === item.id ? { ...i, status: newStatus } : i
    );
    this.prismaItems.set(updatedItems);
  }
}
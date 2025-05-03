// toggle-status.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MaterialModule } from '../../material.module';

interface Operacao {
  isNovo: boolean;
  isEditar: boolean;
  isDetalhar: boolean;
}

@Component({
  selector: 'app-toggle-status',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="toggle-status-container">
      <!-- Modo edição (Novo ou Editar) -->
      <mat-slide-toggle
          *ngIf="isEditMode() && control"
          [formControl]="control">
          {{label}}
      </mat-slide-toggle>

      <!-- Modo visualização (Detalhar) com badges -->
      <div *ngIf="isViewMode() && control" class="details-field">
          <label class="field-label">{{label}}</label>
          <div class="field-value">
              <!-- Badge SIM -->
              <span *ngIf="control.value"
                    class="status-badge status-yes">
                  <mat-icon class="icon-status">check_circle</mat-icon>
                  {{positiveLabel}}
              </span>

              <!-- Badge NÃO -->
              <span *ngIf="!control.value"
                    class="status-badge status-no">
                  <mat-icon class="icon-status">cancel</mat-icon>
                  {{negativeLabel}}
              </span>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .toggle-status-container {
      margin-bottom: 1rem;
    }

    .details-field {
      .field-label {
        display: block;
        color: #666;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .field-value {
        display: flex;
        align-items: center;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 500;
        font-size: 0.875rem;

        .icon-status {
          width: 18px;
          height: 18px;
          font-size: 18px;
          margin-right: 6px;
        }
      }

      .status-yes {
        background-color: #e8f5e9;
        color: #2e7d32;

        .icon-status {
          color: #43a047;
        }
      }

      .status-no {
        background-color: #ffebee;
        color: #c62828;

        .icon-status {
          color: #ef5350;
        }
      }
    }
  `]
})
export class ToggleStatusComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formControlName!: string;
  @Input() label!: string;
  @Input() operacao!: Operacao;
  @Input() positiveLabel: string = 'SIM';
  @Input() negativeLabel: string = 'NÃO';

  control!: FormControl;

  ngOnInit(): void {
    if (!this.formGroup || !this.formControlName) {
      throw new Error('formGroup e formControlName são obrigatórios');
    }

    const formControl = this.formGroup.get(this.formControlName);
    if (!formControl) {
      throw new Error(`FormControl '${this.formControlName}' não encontrado`);
    }

    this.control = formControl as FormControl;
  }

  isEditMode(): boolean {
    return this.operacao.isNovo || this.operacao.isEditar;
  }

  isViewMode(): boolean {
    return this.operacao.isDetalhar;
  }
}

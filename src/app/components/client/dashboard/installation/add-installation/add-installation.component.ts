import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { InstallationService } from '../../../../../core/services/installation.service';
import { Installation } from '../../../../../core/models/installation';
import { AuthService } from '../../../../../core/services/auth';

@Component({
  selector: 'app-add-installation',
  template: `
    <div class="dialog-container">
      <header class="dialog-header">
        <h2 class="dialog-title">Add New Installation</h2>
        <p class="dialog-subtitle">Enter the installation details below</p>
      </header>

      <form [formGroup]="installationForm" (ngSubmit)="onSubmit()" class="installation-form">
        <div class="form-grid">
          <!-- Basic Information Section -->
          <div class="form-section">
            <h3 class="section-title">Basic Information</h3>
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Installation Name</mat-label>
              <mat-icon matPrefix class="field-icon">business</mat-icon>
              <input matInput formControlName="name" placeholder="Enter installation name">
              <mat-error *ngIf="installationForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Route</mat-label>
              <mat-icon matPrefix class="field-icon">route</mat-icon>
              <input matInput formControlName="route" placeholder="Enter route">
              <mat-error *ngIf="installationForm.get('route')?.hasError('required')">
                Route is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Box ID</mat-label>
              <mat-icon matPrefix class="field-icon">inventory_2</mat-icon>
              <input matInput formControlName="boxId" placeholder="Enter box ID">
              <mat-error *ngIf="installationForm.get('boxId')?.hasError('required')">
                Box ID is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Location Section -->
          <div class="form-section">
            <h3 class="section-title">Location Details</h3>
            <div class="coordinates-grid">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Latitude</mat-label>
                <mat-icon matPrefix class="field-icon">place</mat-icon>
                <input matInput type="number" formControlName="latitude" placeholder="Enter latitude">
                <mat-error *ngIf="installationForm.get('latitude')?.hasError('required')">
                  Latitude is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Longitude</mat-label>
                <mat-icon matPrefix class="field-icon">explore</mat-icon>
                <input matInput type="number" formControlName="longitude" placeholder="Enter longitude">
                <mat-error *ngIf="installationForm.get('longitude')?.hasError('required')">
                  Longitude is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()" class="cancel-button">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!installationForm.valid" class="submit-button">
            <mat-icon>add_circle</mat-icon>
            Add Installation
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .dialog-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .dialog-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #1a73e8;
    }

    .dialog-subtitle {
      margin: 8px 0 0;
      color: #5f6368;
      font-size: 14px;
    }

    .installation-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
    }

    .form-field {
      width: 100%;
    }

    .coordinates-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 480px) {
      .coordinates-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .field-icon {
      color: #5f6368;
      margin-right: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-button, .submit-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
      height: 40px;
    }

    .submit-button {
      background-color: #1a73e8;
    }

    .submit-button:disabled {
      background-color: rgba(26, 115, 232, 0.5);
    }

    ::ng-deep .mat-form-field-wrapper {
      margin-bottom: 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [InstallationService, AuthService]
})
export class AddInstallationComponent {
  // ... rest of the component logic remains the same
  installationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInstallationComponent>,
    private installationService: InstallationService,
    private authService: AuthService
  ) {
    this.installationForm = this.fb.group({
      name: ['', Validators.required],
      route: ['', Validators.required],
      boxId: ['', Validators.required],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      parent: ['ROOT']
    });
  }

  onSubmit(): void {
    if (this.installationForm.valid) {
      this.installationService.addInstallation(this.installationForm.value)
        .subscribe({
          next: (installation: Installation) => {
            this.dialogRef.close(installation);
          },
          error: (error: any) => {
            console.error('Error adding installation:', error);
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

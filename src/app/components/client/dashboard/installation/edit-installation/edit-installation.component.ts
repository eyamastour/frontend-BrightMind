import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Installation } from '../../../../../core/models/installation';

@Component({
  selector: 'app-edit-installation',
  template: `
    <div class="dialog-container">
      <header class="dialog-header">
        <h2 class="dialog-title">Edit Installation</h2>
        <p class="dialog-subtitle">Update installation details below</p>
      </header>

      <form [formGroup]="installationForm" (ngSubmit)="onSubmit()" class="installation-form">
        <div class="form-content">
          <div class="form-field-container">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Installation Name</mat-label>
              <mat-icon matPrefix class="field-icon">business</mat-icon>
              <input matInput formControlName="name" placeholder="Enter installation name">
              <mat-error *ngIf="installationForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <div class="current-details">
              <div class="detail-item">
                <mat-icon class="detail-icon">place</mat-icon>
                <span class="detail-label">Location:</span>
                <span class="detail-value">{{data.latitude}}, {{data.longitude}}</span>
              </div>
              <div class="detail-item">
                <mat-icon class="detail-icon">route</mat-icon>
                <span class="detail-label">Route:</span>
                <span class="detail-value">{{data.route}}</span>
              </div>
              <div class="detail-item">
                <mat-icon class="detail-icon">inventory_2</mat-icon>
                <span class="detail-label">Box ID:</span>
                <span class="detail-value">{{data.boxId}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()" class="cancel-button">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!installationForm.valid" class="submit-button">
            <mat-icon>save</mat-icon>
            Update Installation
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      max-width: 500px;
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

    .form-content {
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .form-field-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-field {
      width: 100%;
    }

    .field-icon {
      color: #5f6368;
      margin-right: 8px;
    }

    .current-details {
      background-color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-icon {
      color: #5f6368;
      margin-right: 8px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .detail-label {
      color: #5f6368;
      font-weight: 500;
      margin-right: 8px;
      min-width: 70px;
    }

    .detail-value {
      color: #202124;
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
  ]
})
export class EditInstallationComponent {
  installationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInstallationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Installation
  ) {
    this.installationForm = this.fb.group({
      name: [data.name, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.installationForm.valid) {
      const updatedInstallation = {
        ...this.data,
        ...this.installationForm.value
      };
      this.dialogRef.close(updatedInstallation);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
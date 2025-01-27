import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Installation } from '../../../../../core/models/installation';

@Component({
  selector: 'app-edit-installation',
  template: `
    <h2 mat-dialog-title>Edit Installation</h2>
    <form [formGroup]="installationForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Installation Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter installation name">
          <mat-error *ngIf="installationForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!installationForm.valid">
          Update Installation
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-dialog-content {
      min-width: 350px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
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

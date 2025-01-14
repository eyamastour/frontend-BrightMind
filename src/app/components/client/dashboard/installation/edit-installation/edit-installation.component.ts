import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InstallationService } from '../../../../../core/services/installation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-installation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Edit Installation</h2>
    <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill">
        <mat-label>Installation Name</mat-label>
        <input matInput formControlName="name" required>
      </mat-form-field>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-button color="primary" type="submit" [disabled]="!editForm.valid">Save</button>
      </div>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }
    [mat-dialog-actions] {
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class EditInstallationComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private installationService: InstallationService,
    private dialogRef: MatDialogRef<EditInstallationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { installation: any }
  ) {
    this.editForm = this.fb.group({
      name: [data.installation.name, Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.installationService.updateInstallation(
        this.data.installation._id,
        this.editForm.value
      ).subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error updating installation:', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

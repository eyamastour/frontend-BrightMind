import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Installation } from '../../../../../core/models/installation';

@Component({
  selector: 'app-delete-installation',
  template: `
    <h2 mat-dialog-title>Delete Installation</h2>
    <div mat-dialog-content>
      <p>Are you sure you want to delete the installation "{{ data.name }}"?</p>
      <p class="warning">This action cannot be undone. All associated rooms and devices will also be deleted.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Delete Installation
      </button>
    </div>
  `,
  styles: [`
    .warning {
      color: #dc3545;
      margin-top: 10px;
    }
    mat-dialog-content {
      min-width: 350px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class DeleteInstallationComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteInstallationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Installation
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Device } from '../../../../../core/models/device.model';

@Component({
  selector: 'app-delete-device',
  template: `
    <h2 mat-dialog-title>Delete Device</h2>
    <div mat-dialog-content>
      <p>Are you sure you want to delete the device "{{ data.name }}"?</p>
      <p class="warning">This action cannot be undone.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Delete
      </button>
    </div>
  `,
  styles: [`
    .warning {
      color: #f44336;
      margin-top: 10px;
    }
    mat-dialog-content {
      min-width: 300px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class DeleteDeviceComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

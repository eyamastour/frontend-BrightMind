import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Device } from '../../../../../core/models/device.model';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h2 mat-dialog-title>Set Threshold Value for {{ data.name }}</h2>
    <mat-dialog-content>
      <p>Current value: {{ data.value }}</p>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Threshold Value</mat-label>
        <input matInput type="number" [(ngModel)]="threshold" placeholder="Enter threshold value">
      </mat-form-field>
      <p class="info-text">An alarm will be triggered if the device value exceeds this threshold.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .info-text {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class NotificationDialogComponent {
  threshold: number;

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device
  ) {
    this.threshold = data.threshold || data.value;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      ...this.data,
      threshold: this.threshold
    });
  }
}

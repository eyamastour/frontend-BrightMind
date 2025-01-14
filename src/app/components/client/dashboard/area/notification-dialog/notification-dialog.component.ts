import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Device } from '../../../../../core/models/device.model';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h2 mat-dialog-title>Update Sensor Value</h2>
    <div mat-dialog-content>
      <h3>{{ data.device.name }}</h3>
      <p class="description">This page will allow you to update the value of the sensor. If the value exceeds the threshold, an alarm will be triggered.</p>
      
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>New Value</mat-label>
        <input matInput type="number" [(ngModel)]="newValue" placeholder="Enter new value">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onUpdate()">Update</button>
    </div>
  `,
  styles: [`
    .description {
      color: #666;
      margin-bottom: 20px;
    }
    .full-width {
      width: 100%;
    }
    mat-form-field {
      margin-bottom: 15px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class NotificationDialogComponent {
  newValue: number = 0;

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { device: Device }
  ) {
    this.newValue = data.device.value || 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    const previousValue = this.data.device.value || 0;
    const result = {
      value: this.newValue,
      triggerAlarm: this.newValue > previousValue
    };
    this.dialogRef.close(result);
  }
}

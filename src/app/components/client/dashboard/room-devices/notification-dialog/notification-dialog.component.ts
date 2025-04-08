import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Device } from '../../../../../core/models/device.model';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h2 mat-dialog-title>Set Threshold Value for {{ data.name }}</h2>
    <mat-dialog-content>
      <div class="alarm-status" *ngIf="wouldTriggerAlarm()">
        <mat-icon class="alarm-icon">warning</mat-icon>
        <span class="alarm-text">
          {{ hasActiveAlarm ? 'Active Alarm' : 'Would Trigger Alarm' }}: 
          Device value ({{ data.value }}) exceeds {{ threshold !== null ? 'new' : '' }} threshold ({{ threshold || data.threshold }})
        </span>
      </div>
      <div class="alarm-status no-alarm" *ngIf="!wouldTriggerAlarm() && (data.threshold || threshold)">
        <mat-icon class="status-icon">check_circle</mat-icon>
        <span class="status-text">
          No {{ hasActiveAlarm ? 'future' : '' }} alarm. 
          {{ threshold !== null && threshold !== data.threshold ? 'New' : 'Current' }} threshold: {{ threshold || data.threshold }}
        </span>
      </div>
      <p>Current value: {{ data.value }}</p>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Threshold Value</mat-label>
        <input matInput type="number" [(ngModel)]="threshold" (ngModelChange)="onThresholdChange()" placeholder="Enter threshold value">
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
    .alarm-status {
      display: flex;
      align-items: center;
      background-color: #ffebee;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 15px;
    }
    .no-alarm {
      background-color: #e8f5e9;
    }
    .alarm-icon {
      color: #f44336;
      margin-right: 8px;
    }
    .status-icon {
      color: #4caf50;
      margin-right: 8px;
    }
    .alarm-text {
      color: #d32f2f;
      font-weight: 500;
    }
    .status-text {
      color: #2e7d32;
      font-weight: 500;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class NotificationDialogComponent {
  threshold: number | null = null;
  hasActiveAlarm: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device & { hasActiveAlarm?: boolean }
  ) {
    // Initialize threshold with the current device threshold
    this.threshold = data.threshold !== undefined ? data.threshold : null;
    
    // Use the hasActiveAlarm property if it's provided, otherwise calculate it
    this.hasActiveAlarm = data.hasActiveAlarm !== undefined 
      ? data.hasActiveAlarm 
      : this.checkAlarmStatus();
  }

  private checkAlarmStatus(): boolean {
    // Check if the device has a threshold and if the current value exceeds it
    return !!(this.data.threshold && 
              typeof this.data.value === 'number' && 
              this.data.value > this.data.threshold);
  }

  // Check if the current value would trigger an alarm with the new threshold
  wouldTriggerAlarm(): boolean {
    const thresholdToCheck = this.threshold !== null ? this.threshold : this.data.threshold;
    return !!(thresholdToCheck && 
              typeof this.data.value === 'number' && 
              this.data.value > thresholdToCheck);
  }

  // Update UI when threshold changes
  onThresholdChange(): void {
    // No need to do anything else, the wouldTriggerAlarm() method will be called by the template
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Make sure to preserve the hasActiveAlarm property when saving
    const result = {
      ...this.data,
      threshold: this.threshold !== null ? this.threshold : this.data.threshold
    };
    
    // Remove the hasActiveAlarm property from the result as it's not part of the Device model
    // and shouldn't be sent to the backend
    if ('hasActiveAlarm' in result) {
      delete (result as any).hasActiveAlarm;
    }
    
    this.dialogRef.close(result);
  }
}

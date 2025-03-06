import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Device } from '../../../../../core/models/device.model';

@Component({
  selector: 'app-edit-device',
  template: `
    <h2 mat-dialog-title>Edit Device</h2>
    <form [formGroup]="deviceForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Type</mat-label>
          <mat-select formControlName="deviceType" required>
            <mat-option value="sensor">Sensor</mat-option>
            <mat-option value="actuator">Actuator</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Zone</mat-label>
          <input matInput formControlName="zone">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Value</mat-label>
          <input matInput formControlName="value">
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!deviceForm.valid">
          Save Changes
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
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class EditDeviceComponent {
  deviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device
  ) {
    this.deviceForm = this.fb.group({
      name: [data.name, Validators.required],
      type: [data.deviceType, Validators.required],
      zone: [data.zone],
      value: [data.value],
      enableConnection: [data.enableConnection]
    });
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      this.dialogRef.close({
        ...this.data,
        ...this.deviceForm.value
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

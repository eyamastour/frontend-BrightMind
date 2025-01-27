import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DeviceService } from '../../../../../core/services/device.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class AddDeviceComponent {
  deviceForm: FormGroup;
  deviceTypes = [
    'on/off device',
    'IR telecommand',
    'climatic station',
    'movement station',
    'command motor',
    'camera station',
    'sensor'
  ];

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<AddDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roomId: string, installationId: string }
  ) {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      zone: ['', Validators.required],
      type: ['', Validators.required],
      deviceType: ['actuator', Validators.required],
      status: ['off'],
      value: [0],
      enableConnection: [true]
    });
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      const deviceData = {
        ...this.deviceForm.value,
        roomId: this.data.roomId,
        installationId: this.data.installationId,
        lastUpdated: new Date(),
        connected: true,
        status: this.deviceForm.value.status || 'off'
      };

      console.log('Sending device data:', deviceData); // Debug log

      this.deviceService.addDevice(deviceData).subscribe({
        next: (response) => {
          console.log('Device added successfully:', response); // Debug log
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error adding device:', error);
          // You might want to show an error message to the user here
          alert('Failed to add device. Please try again.'); // Simple error feedback
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

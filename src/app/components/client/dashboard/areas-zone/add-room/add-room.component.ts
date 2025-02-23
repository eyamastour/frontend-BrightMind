import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-room',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="room-icon">meeting_room</mat-icon>
        <h2>Add New Room</h2>
      </div>

      <div class="dialog-content">
        <form [formGroup]="roomForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Room Name *</label>
            <input 
              id="name"
              type="text"
              class="form-control"
              formControlName="name"
              placeholder="Enter room name"
            />
            <div class="error" *ngIf="roomForm.get('name')?.hasError('required')">
              Name is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              class="form-control"
              formControlName="description"
              placeholder="Enter room description"
              rows="3"
            ></textarea>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="!roomForm.valid">Add Room</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 40px;
      min-width: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      margin-bottom: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .room-icon {
      color: #007bff;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 22px;
      color: #333;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #555;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 4px rgba(0,123,255,0.3);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    .error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    .btn-primary, .btn-secondary {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #b3d7ff;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f8f9fa;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #e2e6ea;
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
export class AddRoomComponent {
  roomForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { installationId: string }
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      installation: [data.installationId]
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      this.dialogRef.close(this.roomForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

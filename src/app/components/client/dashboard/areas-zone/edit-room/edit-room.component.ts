import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../core/models/room.model';

@Component({
  selector: 'app-edit-room',
  template: `
    <div class="dialog-container">
      <header class="dialog-header">
        <h2 class="dialog-title">Edit Room</h2>
        <p class="dialog-subtitle">Update room information below</p>
      </header>

      <form [formGroup]="roomForm" (ngSubmit)="onSubmit()" class="room-form">
        <div class="form-content">
          <div class="form-field-container">
            <!-- Room Name Field -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Room Name</mat-label>
              <mat-icon matPrefix class="field-icon">meeting_room</mat-icon>
              <input matInput formControlName="name" placeholder="Enter room name">
              <mat-error *ngIf="roomForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <!-- Description Field -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Description</mat-label>
              <mat-icon matPrefix class="field-icon">description</mat-icon>
              <textarea 
                matInput 
                formControlName="description" 
                placeholder="Enter room description" 
                rows="4"
                class="description-textarea"
              ></textarea>
              <mat-hint align="end">
                {{roomForm.get('description')?.value?.length || 0}} characters
              </mat-hint>
            </mat-form-field>

            <!-- Current Settings Summary -->
            
          </div>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()" class="cancel-button">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!roomForm.valid" class="submit-button">
            <mat-icon>save</mat-icon>
            Update Room
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    .dialog-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .dialog-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #1a73e8;
    }

    .dialog-subtitle {
      margin: 8px 0 0;
      color: #5f6368;
      font-size: 14px;
    }

    .room-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-content {
      padding: 24px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .form-field-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field {
      width: 100%;
    }

    .field-icon {
      color: #5f6368;
      margin-right: 8px;
    }

    .description-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .room-details {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .details-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .details-title-icon {
      color: #1a73e8;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-icon {
      color: #5f6368;
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .detail-label {
      color: #5f6368;
      font-weight: 500;
      margin-right: 8px;
      min-width: 80px;
    }

    .detail-value {
      color: #202124;
      flex: 1;
      word-break: break-word;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-button, .submit-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
      height: 40px;
    }

    .submit-button {
      background-color: #1a73e8;
    }

    .submit-button:disabled {
      background-color: rgba(26, 115, 232, 0.5);
    }

    ::ng-deep .mat-form-field-wrapper {
      margin-bottom: 0;
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
export class EditRoomComponent {
  roomForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room
  ) {
    this.roomForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description || '']
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const updatedRoom = {
        ...this.data,
        ...this.roomForm.value
      };
      this.dialogRef.close(updatedRoom);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
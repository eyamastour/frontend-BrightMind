import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../core/models/room.model';

@Component({
  selector: 'app-edit-room',
  template: `
    <h2 mat-dialog-title>Edit Room</h2>
    <form [formGroup]="roomForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Room Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter room name">
          <mat-error *ngIf="roomForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter room description" rows="3"></textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!roomForm.valid">
          Update Room
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
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

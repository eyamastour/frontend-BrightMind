import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../core/models/room.model';

@Component({
  selector: 'app-delete-room',
  template: `
    <h2 mat-dialog-title>Delete Room</h2>
    <div mat-dialog-content>
      <p>Are you sure you want to delete the room "{{ data.name }}"?</p>
      <p class="warning">This action cannot be undone. All associated devices will also be deleted.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Delete Room
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
export class DeleteRoomComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

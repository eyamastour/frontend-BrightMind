import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Installation } from '../../../../../core/models/installation';

@Component({
  selector: 'app-delete-installation',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 class="dialog-title">Delete Installation</h2>
      </div>

      <div class="dialog-content">
        <div class="installation-info">
          <mat-icon class="installation-icon">business</mat-icon>
          <span class="installation-name">{{ data.name }}</span>
        </div>

        <div class="warning-section">
          <div class="warning-item">
            <mat-icon class="warning-bullet">error</mat-icon>
            <p class="warning-text">This action cannot be undone</p>
          </div>
          
          <div class="warning-item">
            <mat-icon class="warning-bullet">meeting_room</mat-icon>
            <p class="warning-text">All rooms within this installation will be permanently deleted</p>
          </div>
          
          <div class="warning-item">
            <mat-icon class="warning-bullet">devices</mat-icon>
            <p class="warning-text">All associated devices will be permanently deleted</p>
          </div>

          <div class="warning-item">
            <mat-icon class="warning-bullet">route</mat-icon>
            <p class="warning-text">All route configurations will be lost</p>
          </div>
          
          <div class="warning-item">
            <mat-icon class="warning-bullet">schedule</mat-icon>
            <p class="warning-text">All historical data and analytics will be lost</p>
          </div>
        </div>

        <div class="confirmation-text">
          Are you absolutely sure you want to delete this installation and all its contents?
        </div>
      </div>

      <div class="dialog-actions">
        <button 
          mat-button 
          class="cancel-button" 
          (click)="onCancel()"
        >
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        
        <button 
          mat-raised-button 
          color="warn" 
          class="delete-button" 
          (click)="onConfirm()"
        >
          <mat-icon>delete_forever</mat-icon>
          Delete Installation
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      max-width: 480px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .warning-icon {
      color: #d93025;
      width: 28px;
      height: 28px;
      font-size: 28px;
    }

    .dialog-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #d93025;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .installation-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .installation-icon {
      color: #5f6368;
    }

    .installation-name {
      font-size: 16px;
      font-weight: 500;
      color: #202124;
    }

    .warning-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background-color: #fef7f6;
      border-radius: 8px;
      border: 1px solid #fad2cf;
    }

    .warning-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .warning-bullet {
      color: #d93025;
      width: 20px;
      height: 20px;
      font-size: 20px;
      flex-shrink: 0;
    }

    .warning-text {
      margin: 0;
      color: #3c4043;
      font-size: 14px;
      line-height: 20px;
    }

    .confirmation-text {
      text-align: center;
      font-weight: 500;
      color: #202124;
      padding: 8px;
      background-color: #fef7f6;
      border-radius: 4px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-button, .delete-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px;
      height: 36px;
    }

    .delete-button {
      background-color: #d93025;
    }

    .delete-button:hover {
      background-color: #c5221f;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DeleteInstallationComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteInstallationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Installation
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
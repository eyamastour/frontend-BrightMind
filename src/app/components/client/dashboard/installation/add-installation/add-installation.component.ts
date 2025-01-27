import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { InstallationService } from '../../../../../core/services/installation.service';
import { Installation } from '../../../../../core/models/installation';

@Component({
  selector: 'app-add-installation',
  template: `
    <h2 mat-dialog-title>Add New Installation</h2>
    <form [formGroup]="installationForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Installation Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter installation name">
          <mat-error *ngIf="installationForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Route</mat-label>
          <input matInput formControlName="route" placeholder="Enter route">
          <mat-error *ngIf="installationForm.get('route')?.hasError('required')">
            Route is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Box ID</mat-label>
          <input matInput formControlName="boxId" placeholder="Enter box ID">
          <mat-error *ngIf="installationForm.get('boxId')?.hasError('required')">
            Box ID is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Latitude</mat-label>
          <input matInput type="number" formControlName="latitude" placeholder="Enter latitude">
          <mat-error *ngIf="installationForm.get('latitude')?.hasError('required')">
            Latitude is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Longitude</mat-label>
          <input matInput type="number" formControlName="longitude" placeholder="Enter longitude">
          <mat-error *ngIf="installationForm.get('longitude')?.hasError('required')">
            Longitude is required
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!installationForm.valid">
          Add Installation
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
  ],
  providers: [InstallationService]
})
export class AddInstallationComponent {
  installationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInstallationComponent>,
    private installationService: InstallationService
  ) {
    this.installationForm = this.fb.group({
      name: ['', Validators.required],
      route: ['', Validators.required],
      boxId: ['', Validators.required],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      parent: ['ROOT'] // Default value as per backend model
    });
  }

  onSubmit(): void {
    if (this.installationForm.valid) {
      this.installationService.addInstallation(this.installationForm.value)
        .subscribe({
          next: (installation: Installation) => {
            this.dialogRef.close(installation);
          },
          error: (error: any) => {
            console.error('Error adding installation:', error);
            // You might want to show an error message to the user here
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

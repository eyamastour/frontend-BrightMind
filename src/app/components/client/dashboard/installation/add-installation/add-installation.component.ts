import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { InstallationService } from '../../../../../core/services/installation.service';
import { Installation } from '../../../../../core/models/installation';
import { AuthService } from '../../../../../core/services/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-installation',
  template: `
    <div class="dialog-container">
      <header class="dialog-header">
        <h2 class="dialog-title">Add New Installation</h2>
        <p class="dialog-subtitle">Enter the installation details below</p>
      </header>

      <form [formGroup]="installationForm" (ngSubmit)="onSubmit()" class="installation-form">
        <!-- Installation Type Selection -->
        <div class="form-section">
          <h3 class="section-title">Installation Type</h3>
          <mat-radio-group formControlName="installationType" class="installation-type-group">
            <mat-radio-button value="new" class="installation-type-option">Create new cluster</mat-radio-button>
            <mat-radio-button value="existing" class="installation-type-option">Add to existing cluster</mat-radio-button>
          </mat-radio-group>
        </div>

        <div class="form-grid">
          <!-- Basic Information Section -->
          <div class="form-section">
            <h3 class="section-title">Basic Information</h3>
            
            <!-- New Cluster Name (shown only when creating a new cluster) -->
            <mat-form-field appearance="outline" class="form-field" *ngIf="isNewCluster()">
              <mat-label>Cluster Name</mat-label>
              <mat-icon matPrefix class="field-icon">business</mat-icon>
              <input matInput formControlName="cluster" placeholder="Enter cluster name">
              <mat-error *ngIf="installationForm.get('cluster')?.hasError('required')">
                Cluster name is required
              </mat-error>
            </mat-form-field>

            <!-- Existing Cluster Selection (shown only when adding to existing cluster) -->
            <mat-form-field appearance="outline" class="form-field" *ngIf="!isNewCluster()">
              <mat-label>Select Cluster</mat-label>
              <mat-icon matPrefix class="field-icon">business</mat-icon>
              <mat-select formControlName="existingClusterId">
                <mat-option *ngFor="let cluster of existingClusters" [value]="cluster._id">
                  {{ cluster.cluster || cluster.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="installationForm.get('existingClusterId')?.hasError('required')">
                Please select a cluster
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Installation Name</mat-label>
              <mat-icon matPrefix class="field-icon">router</mat-icon>
              <input matInput formControlName="name" placeholder="Enter installation name">
              <mat-error *ngIf="installationForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Route</mat-label>
              <mat-icon matPrefix class="field-icon">route</mat-icon>
              <input matInput formControlName="route" placeholder="Enter route">
              <mat-error *ngIf="installationForm.get('route')?.hasError('required')">
                Route is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Box ID</mat-label>
              <mat-icon matPrefix class="field-icon">inventory_2</mat-icon>
              <input matInput formControlName="boxId" placeholder="Enter box ID">
              <mat-error *ngIf="installationForm.get('boxId')?.hasError('required')">
                Box ID is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Location Section -->
         
        </div>

        <!-- Plan Image Upload Section -->
        <div class="form-section">
          <h3 class="section-title">Plan Image</h3>
          <div class="file-upload-container">
            <input 
              type="file" 
              #fileInput 
              style="display: none" 
              accept="image/*" 
              (change)="onFileSelected($event)"
            >
            <div class="file-info">
              <span *ngIf="selectedFile">{{ selectedFile.name }}</span>
              <span *ngIf="!selectedFile">No file selected</span>
            </div>
            <button 
              type="button" 
              mat-raised-button 
              color="primary" 
              class="upload-button" 
              (click)="triggerFileInput()"
            >
              <mat-icon>upload</mat-icon>
              Ajoute Plan
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()" class="cancel-button">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!installationForm.valid" class="submit-button">
            <mat-icon>add_circle</mat-icon>
            Add Installation
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      max-height: 90vh;
      overflow-y: auto;
    }

    .installation-type-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .installation-type-option {
      margin-right: 16px;
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

    .installation-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-section {
      display: flex;
      flex-direction: column;
    }

    .section-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
    }

    .form-field {
      width: 100%;
    }

    .coordinates-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 480px) {
      .coordinates-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .field-icon {
      color: #5f6368;
      margin-right: 8px;
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

    .file-upload-container {
      display: flex;
      align-items: center;
      margin-top: 16px;
      padding: 12px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      background-color: #f9f9f9;
    }

    .file-info {
      flex: 1;
      margin-right: 16px;
      color: #5f6368;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .upload-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #1a73e8;
      color: white;
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
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers: [InstallationService, AuthService, MatSnackBar]
})
export class AddInstallationComponent implements OnInit {
  installationForm!: FormGroup;
  existingClusters: Installation[] = [];
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInstallationComponent>,
    private installationService: InstallationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize the form in ngOnInit instead of constructor
    this.installationForm = this.fb.group({
      installationType: ['new', Validators.required],
      cluster: ['', this.conditionalValidator(() => this.isNewCluster(), Validators.required)],
      existingClusterId: ['', this.conditionalValidator(() => !this.isNewCluster(), Validators.required)],
      name: ['', Validators.required],
      route: ['', Validators.required],
      boxId: ['', Validators.required],

      parent: ['ROOT']
    });

    // Update validators when installation type changes
    if (this.installationForm) {
      this.installationForm.get('installationType')?.valueChanges.subscribe(() => {
        this.installationForm.get('cluster')?.updateValueAndValidity();
        this.installationForm.get('existingClusterId')?.updateValueAndValidity();
      });
    }

    this.loadExistingClusters();
  }

  loadExistingClusters(): void {
    this.installationService.getInstallations().subscribe(
      (installations: Installation[]) => {
        // Only show root installations (clusters) in the dropdown
        this.existingClusters = installations.filter(installation => installation.parent === 'ROOT');
        console.log('Filtered root installations for dropdown:', this.existingClusters);
      },
      (error: any) => {
        console.error('Error loading clusters:', error);
        this.snackBar.open(
          'Failed to load existing clusters. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    );
  }

  isNewCluster(): boolean {
    // Add null check to prevent "Cannot read properties of undefined (reading 'get')" error
    return this.installationForm && this.installationForm.get('installationType') ? 
      this.installationForm.get('installationType')?.value === 'new' : true;
  }

  // Conditional validator function
  conditionalValidator(condition: () => boolean, validator: any) {
    return (control: any) => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }

  onSubmit(): void {
    if (this.installationForm && this.installationForm.valid) {
      const formValue = { ...this.installationForm.value };
      
      // If using existing cluster, get the cluster name from the selected installation
      if (!this.isNewCluster() && formValue.existingClusterId) {
        const selectedCluster = this.existingClusters.find(c => c._id === formValue.existingClusterId);
        if (selectedCluster) {
          console.log('Selected cluster:', selectedCluster);
          // When adding to an existing cluster, use the cluster's name as the cluster value
          formValue.cluster = selectedCluster.cluster || selectedCluster.name;
          formValue.parent = selectedCluster._id; // Set parent to the existing cluster ID
          console.log('Setting parent to:', formValue.parent);
        }
      } else {
        // For new clusters, ensure parent is 'ROOT'
        formValue.parent = 'ROOT';
        // For new clusters, set the cluster name to the provided value
        // This ensures it's recognized as a cluster
        formValue.cluster = formValue.cluster || formValue.name;
        console.log('Setting parent to ROOT for new cluster');
      }
      
      // Set a type field to distinguish between clusters and installations
      // If it's a new cluster or being added to ROOT, it's a cluster
      // Otherwise, it's an installation within a cluster
      formValue.isCluster = this.isNewCluster() || formValue.parent === 'ROOT';
      
      // Remove the installationType and existingClusterId fields before sending to API
      delete formValue.installationType;
      delete formValue.existingClusterId;

      // Set default values for latitude and longitude
      formValue.latitude = 0;
      formValue.longitude = 0;

      console.log('Submitting installation:', formValue);

      this.installationService.addInstallation(formValue)
        .subscribe({
          next: (installation: Installation) => {
            console.log('Installation added successfully:', installation);
            
            // If a file was selected, upload it
            if (this.selectedFile) {
              this.uploadPlanImage(installation._id);
            } else {
              this.dialogRef.close(installation);
            }
          },
          error: (error: any) => {
            console.error('Error adding installation:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to add installation. Please try again.',
              'Close',
              { duration: 5000 }
            );
          }
        });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile.name);
    }
  }

  uploadPlanImage(installationId: string): void {
    if (!this.selectedFile) {
      this.dialogRef.close();
      return;
    }

    this.installationService.uploadPlanImage(installationId, this.selectedFile)
      .subscribe({
        next: (response) => {
          console.log('Plan image uploaded successfully:', response);
          this.snackBar.open('Plan image uploaded successfully', 'Close', { duration: 3000 });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error uploading plan image:', error);
          this.snackBar.open(
            error.error?.message || 'Failed to upload plan image. Please try again.',
            'Close',
            { duration: 5000 }
          );
          // Still close the dialog as the installation was created successfully
          this.dialogRef.close();
        }
      });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

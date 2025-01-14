import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { InstallationService } from '../../../../../core/services/installation.service';
import { Installation } from '../../../../../core/models/installation';

interface InstallationFormData {
  name: string;
  route: string;
  boxId: string;
  latitude: string;
  longitude: string;
  parent: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule
  ],
  selector: 'app-add-installation',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <i class="router-icon">📡</i>
            Add Installation
      </h2>
      
      <mat-dialog-content>
        <form #form="ngForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" [(ngModel)]="formData.name" name="name">
          </div>
          
          <div class="form-group">
            <label for="parent">Parent Installation</label>
            <div class="select-wrapper">
              <mat-select [(ngModel)]="formData.parent" name="parent">
                <mat-option value="ROOT">ROOT</mat-option>
                <mat-option *ngFor="let installation of availableInstallations" [value]="installation._id">
                  {{ installation.name }}
                </mat-option>
              </mat-select>
            </div>
          </div>

          <div class="form-group">
            <label for="route">Route</label>
            <div class="select-wrapper">
              <input type="text" [(ngModel)]="formData.route" name="route" />
            </div>
          </div>
          
          <div class="form-group">
            <label for="boxId">BOX-IO ID</label>
            <input type="text" id="boxId" [(ngModel)]="formData.boxId" name="boxId">
          </div>
          
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input type="text" id="latitude" [(ngModel)]="formData.latitude" name="latitude">
          </div>
          
          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input type="text" id="longitude" [(ngModel)]="formData.longitude" name="longitude">
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        <button mat-button color="primary" (click)="onSubmit()">
          <span class="plus-icon">+</span> Add
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      min-width: 400px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .form-group input, .form-group mat-select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .router-icon {
      font-style: normal;
      margin-right: 8px;
    }
    
    .plus-icon {
      margin-right: 4px;
    }
    
    mat-dialog-actions {
      margin-top: 20px;
      padding: 20px 0 0;
      border-top: 1px solid #eee;
    }
  `]
})
export class AddInstallationComponent implements OnInit {
  formData: InstallationFormData = {
    name: '',
    route: '',
    boxId: '',
    latitude: '',
    longitude: '',
    parent: 'ROOT'
  };

  availableInstallations: Installation[] = [];

  constructor(
    private installationService: InstallationService,
    public dialogRef: MatDialogRef<AddInstallationComponent>
  ) {}

  ngOnInit() {
    this.loadInstallations();
  }

  loadInstallations() {
    this.installationService.getInstallations().subscribe(
      installations => {
        this.availableInstallations = installations;
      },
      error => {
        console.error('Error loading installations:', error);
      }
    );
  }

  onSubmit(): void {
    console.log('Form submitted:', this.formData);

    // Convert latitude and longitude to numbers before passing to the service
    const installationData = {
      ...this.formData,
      latitude: parseFloat(this.formData.latitude),
      longitude: parseFloat(this.formData.longitude)
    };

    if (isNaN(installationData.latitude) || isNaN(installationData.longitude)) {
      console.error('Invalid latitude or longitude. Please provide valid numbers.');
      return;
    }

    // Call the service to add the installation
    this.installationService.addInstallation(installationData).subscribe(
      response => {
        console.log('Installation added:', response);
        this.dialogRef.close();
      },
      error => {
        console.error('Error adding installation:', error);
      }
    );
    window.location.reload();
  }
}

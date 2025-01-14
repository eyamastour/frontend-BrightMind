import { Component, Inject } from '@angular/core';
import { deleteJobConstant, errorMessages } from './delete-installation.constants';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InstallationService } from '../../../../../core/services/installation.service';

@Component({
  selector: 'app-delete-installation',
  imports: [MatDialogModule],
  templateUrl: './delete-installation.component.html',
  styleUrl: './delete-installation.component.css'
})
export class DeleteInstallationComponent {
deleteJobConstant = deleteJobConstant;
  installationId: string; 
  errorMessages = {
    success: 'Installation deleted successfully',
    successTitle: 'Success',
    error: 'Failed to delete installation',
    errorTitle: 'Error'
  };
  constructor(
    public dialogRef: MatDialogRef<DeleteInstallationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private installationService: InstallationService
  ) {
    console.log('Data received in DeleteInstallationComponent:', data);
    this.installationId = data.installationId;
  }
  
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.deleteInstallation();
  }

  deleteInstallation(): void {
    if (!this.installationId) {
      console.error('Installation ID is not defined');
      return;
    }
  
    console.log('Deleting installation with ID:', this.installationId);
    this.installationService.deleteInstallation(this.installationId).subscribe(
      () => {
        this.toastr.success(this.errorMessages.success, this.errorMessages.successTitle);
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error deleting installation:', error);
        this.toastr.error(this.errorMessages.error, this.errorMessages.errorTitle);
        this.dialogRef.close(false);
      }
    );
  }
  
}
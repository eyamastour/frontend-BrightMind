import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { deleteJobConstant, errorMessages } from './delete-area.constants';
import { DeviceService } from '../../../../../core/services/device.service';

@Component({
  selector: 'app-delete-area',
  imports: [MatDialogModule ],
  templateUrl: './delete-area.component.html',
  styleUrl: './delete-area.component.css'
})
export class DeleteAreaComponent {
  deleteJobConstant = deleteJobConstant;
  errorMessages = errorMessages;

  constructor(
    public deviceService: DeviceService, 
    public dialogRef: MatDialogRef<DeleteAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private toastr: ToastrService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    console.log('Device:', this.data.device);  // Vérifiez l'objet device reçu
    if (this.data && this.data.device && this.data.device._id) {
      this.deviceService.deleteDevice(this.data.device._id).subscribe(
        () => {
          this.toastr.success('Le périphérique a été supprimé avec succès.', 'Succès');
          this.dialogRef.close(true); // Fermer le dialog après succès
          window.location.reload(); // Rafraîchir la page
        },
        (error) => {
          console.error('Erreur lors de la suppression du périphérique:', error);
          this.toastr.error('Une erreur est survenue lors de la suppression.', 'Erreur');
          this.dialogRef.close(false);
        }
      );
    } else {
      console.error('Aucun ID de périphérique fourni pour la suppression');
      this.toastr.error('Aucun ID de périphérique fourni pour la suppression', 'Erreur');
      this.dialogRef.close(false);
    }
  }
  
  
  
  
  



}

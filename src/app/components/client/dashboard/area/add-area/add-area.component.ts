import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Device } from '../../../../../core/models/device.model';
import { DeviceService } from '../../../../../core/services/device.service';
import { FormsModule } from '@angular/forms';  // Ajoutez cette ligne
import { MatInputModule } from '@angular/material/input';  // Ajoutez cette ligne si ce n'est pas déjà fait
import { MatSelectModule } from '@angular/material/select';  // Importer MatSelectModule
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-area',
  imports: [FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.css']
})
export class AddAreaComponent {
  newDevice: Device = {
    _id: '',    
    name: '',
    zone: '',
    deviceType: '',
    status: 'active',  // ou un autre statut par défaut
    type: 'sensor',    // ou un autre type par défaut
    enableConnection: true,  // ou un autre état par défaut
    lastUpdated: new Date(), // mettre la date actuelle par défaut
    value: 0,             // ou un autre nombre par défaut
    installationId: ''   // Ajoutez cette ligne
  };

  formSubmitted = false;

  constructor(
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<AddAreaComponent>,  // Référence pour fermer le dialog
    @Inject(MAT_DIALOG_DATA) public data: any  // Récupérer les données passées
  ) {
    // Vérifier si l'installationId est passé via les données
    if (this.data && this.data.installationId) {
      this.newDevice.installationId = this.data.installationId;
      console.log('Installation ID reçu dans le dialogue:', this.newDevice.installationId);
    } else {
      console.error('Installation ID manquant dans les données!');
    }
  }

  addDevice(): void {
    this.formSubmitted = true;

    // Log pour vérifier l'état de newDevice avant soumission
    console.log('newDevice before submission:', this.newDevice);

    if (this.newDevice.name && this.newDevice.zone && this.newDevice.deviceType && this.newDevice.installationId) {
      this.deviceService.addDevice(this.newDevice).subscribe(
        (response) => {
          console.log('Device added successfully:', response);
          this.dialogRef.close(true); // Fermer le dialog après succès
          window.location.reload(); // Rafraîchir la page
          this.closeDialog();
        },
        (error) => {
          console.error('Error adding device:', error);
        }
      );
    } else {
      console.log('Form is incomplete or Installation ID is missing!');
    }
  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }
}

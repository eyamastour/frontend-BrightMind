// area.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAreaComponent } from './delete-area/delete-area.component';
import { AddAreaComponent } from './add-area/add-area.component';
import { Device } from '../../../../core/models/device.model';
import { DeviceService } from '../../../../core/services/device.service';
import { AsideComponent } from '../../../../shared/aside/aside.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.css',
  standalone: true, 
  imports: [CommonModule, MatIconModule, RouterModule, AsideComponent, NotificationDialogComponent]  
})
export class AreaComponent implements OnInit {
  installationName!: string;
  id: number | undefined;
  devices: Device[] = [];
  installationId: string | null = null;
  isAdmin = false;

  constructor(
    private deviceService: DeviceService, 
    private dialog: MatDialog, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.installationId = params.get('installationId');
      console.log('Installation ID:', this.installationId); 
      if (this.installationId) {
        this.loadDevices(this.installationId);
      }
    });
  }
  
  openEditDialog(): void {
    this.dialog.open(EditAreaComponent, {
      width: '400px',
      data: { /* vous pouvez passer des données ici si nécessaire */ }
    });
  }
  loadDevices(installationId: string): void {
    // Fetch devices for the selected installation
    this.deviceService.getDevicesByInstallation(installationId).subscribe(
      (data) => {
        // Vérifiez que chaque device contient un id
        this.devices = data.map(device => {
          if (!device._id) {
            console.error('Le device ne contient pas un _id', device);
          }
          return device;
        });
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
  }
  
  openDeleteDialog(device: Device): void {
    console.log('Device to delete:', device);  // Vérifiez l'objet device
    const dialogRef = this.dialog.open(DeleteAreaComponent, {
      data: { device: device }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }
  

  
  
  openAddDialog(): void {
    // Passer l'installationId via MAT_DIALOG_DATA
    this.dialog.open(AddAreaComponent, {
      data: { installationId: this.installationId }  // Passez l'ID ici
    }).afterClosed().subscribe(result => {
      // Vous pouvez traiter la fermeture du dialogue ici
      console.log('Dialog fermé avec résultat:', result);
    });
  }

  openNotificationDialog(device: Device): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '400px',
      data: { device: device }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && device._id) {
        // Update the device value and alarm status
        device.value = result.value;
        this.deviceService.updateDevice(device._id, { 
          value: result.value,
          triggerAlarm: result.triggerAlarm
        }).subscribe(
          () => {
            console.log('Device value updated successfully');
            if (result.triggerAlarm) {
              console.log('Alarm triggered due to value increase!');
              // Update the alarms count in the stats
              const alarmsElement = document.querySelector('.stat-value') as HTMLElement;
              if (alarmsElement) {
                const currentAlarms = parseInt(alarmsElement.innerText) || 0;
                alarmsElement.innerText = (currentAlarms + 1).toString();
              }
            }
            // Refresh the devices list
            if (this.installationId) {
              this.loadDevices(this.installationId);
            }
          },
          (error: Error) => {
            console.error('Error updating device value:', error);
          }
        );
      }
    });
  }
}

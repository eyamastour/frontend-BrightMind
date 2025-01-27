import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsideComponent } from '../../../../shared/aside/aside.component';
import { DeviceService } from '../../../../core/services/device.service';
import { Device } from '../../../../core/models/device.model';
import { AuthService } from '../../../../core/services/auth';
import { AddDeviceComponent } from './add-device/add-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { DeleteDeviceComponent } from './delete-device/delete-device.component';

@Component({
  selector: 'app-room-devices',
  templateUrl: './room-devices.component.html',
  styleUrls: ['./room-devices.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    AsideComponent,
    RouterModule,
    EditDeviceComponent,
    DeleteDeviceComponent
  ]
})
export class RoomDevicesComponent implements OnInit {
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  roomId: string | null = null;
  searchTerm: string = '';
  isAdmin: boolean = false;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.isAdmin = this.authService.isAdmin();
    this.loadDevices();
  }

  loadDevices(): void {
    if (!this.roomId) {
      console.error('Room ID is not provided');
      return;
    }

    this.isLoading = true;
    this.deviceService.getDevicesByRoom(this.roomId).subscribe({
      next: (devices) => {
        this.devices = devices.map(device => ({
          ...device,
          enableConnection: true,
          zone: device.zone || 'Default Zone'
        }));
        this.updateFilteredDevices();
      },
      error: (error) => {
        console.error('Error fetching devices:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddDeviceComponent, {
      width: '500px',
      data: {
        roomId: this.roomId,
        installationId: this.deviceService.getInstallationId()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDevices(); // Reload devices after adding a new one
      }
    });
  }

  openEditDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditDeviceComponent, {
      width: '500px',
      data: device
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.updateDevice(result._id, result).subscribe({
          next: () => {
            this.loadDevices(); // Reload devices after updating
          },
          error: (error) => {
            console.error('Error updating device:', error);
          }
        });
      }
    });
  }

  openDeleteDialog(device: Device): void {
    const dialogRef = this.dialog.open(DeleteDeviceComponent, {
      width: '400px',
      data: device
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && device._id) {
        this.deviceService.deleteDevice(device._id).subscribe({
          next: () => {
            this.loadDevices(); // Reload devices after deletion
          },
          error: (error) => {
            console.error('Error deleting device:', error);
          }
        });
      }
    });
  }

  openNotificationDialog(device: Device): void {
    // Implement notification settings dialog
    console.log('Opening notification dialog for device:', device);
  }

  updateFilteredDevices(): void {
    if (!this.searchTerm) {
      this.filteredDevices = this.devices;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredDevices = this.devices.filter(device => 
      device.name.toLowerCase().includes(searchTermLower) ||
      device.type?.toLowerCase().includes(searchTermLower) ||
      device.zone?.toLowerCase().includes(searchTermLower)
    );
  }

  ngDoCheck(): void {
    this.updateFilteredDevices();
  }
}

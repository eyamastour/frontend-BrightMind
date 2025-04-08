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
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';

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
    DeleteDeviceComponent,
    NotificationDialogComponent
  ]
})
export class RoomDevicesComponent implements OnInit {
  // Map device types to their corresponding units
  private deviceUnits: { [key: string]: string } = {
    'climatic station': '°C',
    'movement station': 'count',
    'sensor': '',  // Generic sensor, will be determined based on context
    'on/off device': '',
    'IR telecommand': '',
    'command motor': '%',
    'camera station': ''
  };
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  roomId: string | null = null;
  searchTerm: string = '';
  isAdmin: boolean = false;
  isLoading: boolean = false;
  activeAlarms: Set<string> = new Set();

  toggleDeviceConnection(device: Device): void {
    // Only allow toggling for actuator devices
    if (device.deviceType !== 'actuator') {
      return;
    }
    
    // Only toggle the enableConnection property for UI representation
    // without changing the status (active/inactive)
    device.enableConnection = !device.enableConnection;
    
    // For actuators, also toggle the value in UI only (on/off)
    if (typeof device.value === 'boolean') {
      device.value = !device.value;
    }
    
    // No backend update - only UI representation is changed
    this.updateFilteredDevices();
  }

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
    
    // Set up periodic checks for device values
    setInterval(() => {
      this.devices.forEach(device => {
        this.checkThreshold(device);
      });
    }, 5000); // Check every 5 seconds
  }

  loadDevices(): void {
    if (!this.roomId) {
      console.error('Room ID is not provided');
      return;
    }

    this.isLoading = true;
    this.deviceService.getDevicesByRoom(this.roomId).subscribe({
      next: (devices) => {
        console.log('Loaded devices:', devices);
        this.devices = devices.map(device => ({
          ...device,
          enableConnection: true,
          zone: device.zone || 'Default Zone'
        }));
        
        // Log device types to debug
        this.devices.forEach(device => {
          console.log(`Device ${device.name} has type: "${device.type}" and deviceType: "${device.deviceType}"`);
        });
        
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
    // Check if this device has an active alarm
    const hasActiveAlarm = this.activeAlarms.has(device._id!);
    
    // Create a copy of the device with the active alarm status
    const deviceWithAlarmStatus = {
      ...device,
      hasActiveAlarm
    };
    
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '400px',
      data: deviceWithAlarmStatus
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.updateDevice(result._id!, result).subscribe({
          next: (updatedDevice) => {
            const index = this.devices.findIndex(d => d._id === updatedDevice._id);
            if (index !== -1) {
              this.devices[index] = updatedDevice;
              this.checkThreshold(updatedDevice);
            }
            this.updateFilteredDevices();
          },
          error: (error) => {
            console.error('Error updating device threshold:', error);
          }
        });
      }
    });
  }

  openDeviceGraph(device: Device): void {
    console.log('Opening graph for device:', device);
    // Navigate to the data-graph component with the device ID
    this.router.navigate(['/client/data-graph', device._id]);
  }

  private checkThreshold(device: Device): void {
    // Only check threshold for sensor devices (numerical values)
    if (device.deviceType !== 'sensor' || typeof device.value !== 'number') {
      return;
    }

    if (device.threshold && device.value > device.threshold) {
      if (!this.activeAlarms.has(device._id!)) {
        this.activeAlarms.add(device._id!);
        // Update UI to show alarm
        const alarmCount = this.activeAlarms.size;
        const alarmElement = document.querySelector('.stat-value') as HTMLElement;
        if (alarmElement) {
          alarmElement.textContent = alarmCount.toString();
        }
        // You could also implement a notification system here
        alert(`Alarm: ${device.name}'s value (${device.value}) exceeds threshold (${device.threshold})`);
      }
    } else {
      if (this.activeAlarms.has(device._id!)) {
        this.activeAlarms.delete(device._id!);
        // Update UI to show updated alarm count
        const alarmCount = this.activeAlarms.size;
        const alarmElement = document.querySelector('.stat-value') as HTMLElement;
        if (alarmElement) {
          alarmElement.textContent = alarmCount.toString();
        }
      }
    }
  }


  /**
   * Gets the appropriate unit for a device based on its type
   * @param device The device to get the unit for
   * @returns The unit string to display
   */
  getDeviceUnit(device: Device): string {
    // Only show units for sensor devices with numerical values
    if (device.deviceType !== 'sensor' || typeof device.value !== 'number') {
      return '';
    }

    // Return the unit based on device type
    return this.deviceUnits[device.type] || '';
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Room } from '../../../../core/models/room.model';
import { RoomService } from '../../../../core/services/room.service';
import { Device } from '../../../../core/models/device.model';
import { DeviceService } from '../../../../core/services/device.service';
import { AuthService } from '../../../../core/services/auth';
import { AddRoomComponent } from './add-room/add-room.component';
import { AsideComponent } from '../../../../shared/aside/aside.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-areas-zone',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatDialogModule,
    MatProgressSpinnerModule,
    AsideComponent, 
    RouterModule,
    AddRoomComponent
  ],
  templateUrl: 'src/app/components/client/dashboard/areas-zone/areas-zone.component.html',
  styleUrl: './areas-zone.component.css'
})
export class AreasZoneComponent implements OnInit {
  rooms: Room[] = [];
  devices: Device[] = [];
  showDevices = false;
  selectedRoom: Room | null = null;
  isAdmin = false;

  constructor(
    private roomService: RoomService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const installationId = params['installationId'];
      if (installationId) {
        this.loadRooms(installationId);
      }
    });
  }

  private currentInstallationId: string | null = null;

  loadRooms(installationId: string) {
    this.currentInstallationId = installationId;
    this.roomService.getRoomsByInstallation(installationId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {
      width: '500px',
      data: { installationId: this.currentInstallationId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.currentInstallationId) {
        this.loadRooms(this.currentInstallationId);
      }
    });
  }

  openEditDialog(room: Room): void {
    // TODO: Implement edit room dialog
  }

  openDeleteDialog(room: Room): void {
    // TODO: Implement delete room dialog
  }

  toggleView(showDevices: boolean): void {
    this.showDevices = showDevices;
    if (!showDevices) {
      this.selectedRoom = null;
      this.devices = [];
    }
  }

  errorMessage: string | null = null;
  isLoading = false;

  selectRoom(room: Room): void {
    console.log('Selecting room:', room);
    if (!room._id) {
      console.error('Room ID is missing');
      return;
    }
    this.selectedRoom = room;
    this.showDevices = true;
    this.errorMessage = null;
    this.isLoading = true;
    console.log('Fetching devices for room:', room._id);
    
    this.deviceService.getDevicesByRoom(room._id).subscribe({
      next: (devices) => {
        console.log('Devices received:', devices);
        this.devices = devices;
        if (devices.length === 0) {
          this.errorMessage = 'No devices found in this room';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.errorMessage = 'Failed to load devices. Please try again.';
        this.devices = [];
        this.isLoading = false;
      }
    });
  }

  goToAreas(): void {
    if (this.currentInstallationId) {
      this.router.navigate(['/client/areas', this.currentInstallationId]);
    }
  }
}

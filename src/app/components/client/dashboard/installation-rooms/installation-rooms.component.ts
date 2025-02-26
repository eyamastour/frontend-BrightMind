import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InstallationService } from '../../../../core/services/installation.service';
import { DeviceService } from '../../../../core/services/device.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room } from '../../../../core/models/room.model';
import { Device } from '../../../../core/models/device.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsideComponent } from '../../../../shared/aside/aside.component';
import { AuthService } from '../../../../core/services/auth';
import { MatDialog } from '@angular/material/dialog';
import { AddInstallationComponent } from '../installation/add-installation/add-installation.component';
import { EditInstallationComponent } from '../installation/edit-installation/edit-installation.component';
import { DeleteInstallationComponent } from '../installation/delete-installation/delete-installation.component';
import { AddRoomComponent } from '../areas-zone/add-room/add-room.component';
import { EditRoomComponent } from '../areas-zone/edit-room/edit-room.component';
import { DeleteRoomComponent } from '../areas-zone/delete-room/delete-room.component';
import { DataGraphComponent } from '../data-graph/data-graph.component';

interface RoomWithId extends Room {
  _id: string;
}

@Component({
  selector: 'app-installation-rooms',
  templateUrl: './installation-rooms.component.html',
  styleUrls: ['./installation-rooms.component.css'],
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, MatMenuModule, MatTooltipModule, AsideComponent, RouterModule, DataGraphComponent]
})
export class InstallationRoomsComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  installationId: string | null = null;
  searchTerm: string = '';
  userRole: string = 'user';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private installationService: InstallationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadRooms();
  }

  loadRooms(): void {
    this.installationId = this.route.snapshot.paramMap.get('installationId');
    
    if (this.installationId) {
      // Set the installation ID in the device service
      this.deviceService.setInstallationId(this.installationId);
      
      this.installationService.getRoomsByInstallation(this.installationId).subscribe(
        (rooms) => {
          this.rooms = rooms;
          this.updateFilteredRooms();
        },
        (error: any) => {
          console.error('Error fetching rooms:', error);
        }
      );
    } else {
      console.error('Installation ID is not provided');
    }
  }

  openAddInstallationDialog(): void {
    const dialogRef = this.dialog.open(AddInstallationComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.installationService.addInstallation(result).subscribe(
          () => {
            this.loadRooms();
          },
          (error: any) => {
            console.error('Error adding installation:', error);
          }
        );
      }
    });
  }

  openEditInstallationDialog(installation: any): void {
    if (!installation._id) return;

    const dialogRef = this.dialog.open(EditInstallationComponent, {
      data: installation
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result._id) {
        this.installationService.updateInstallation(result._id, result).subscribe(
          () => {
            this.loadRooms();
          },
          (error: any) => {
            console.error('Error updating installation:', error);
          }
        );
      }
    });
  }

  openDeleteInstallationDialog(installation: any): void {
    if (!installation._id) return;

    const dialogRef = this.dialog.open(DeleteInstallationComponent, {
      data: installation
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.installationService.deleteInstallation(installation._id).subscribe(
          () => {
            this.router.navigate(['/client/dashboard']);
          },
          (error: any) => {
            console.error('Error deleting installation:', error);
          }
        );
      }
    });
  }

  openAddRoomDialog(): void {
    if (!this.installationId) return;

    const dialogRef = this.dialog.open(AddRoomComponent, {
      data: { installationId: this.installationId }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.installationService.createRoom(result).subscribe(
          () => {
            this.loadRooms();
          },
          (error: any) => {
            console.error('Error adding room:', error);
          }
        );
      }
    });
  }

  openEditRoomDialog(room: Room): void {
    if (!this.isRoomWithId(room)) return;

    const dialogRef = this.dialog.open(EditRoomComponent, {
      width: '50vw',
      maxHeight: '80vh', // Hauteur maximale contrôlée
      panelClass: 'custom-dialog-container', // Permet d'ajouter un style spécifique
      autoFocus: false,
      data: room
    });
    
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.isRoomWithId(result)) {
        this.installationService.updateRoom(result._id, result).subscribe(
          () => {
            this.loadRooms();
          },
          (error: any) => {
            console.error('Error updating room:', error);
          }
        );
      }
    });
  }

  openDeleteRoomDialog(room: Room): void {
    if (!this.isRoomWithId(room)) return;

    const dialogRef = this.dialog.open(DeleteRoomComponent, {
      data: room
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.installationService.deleteRoom(room._id).subscribe(
          () => {
            this.loadRooms();
            window.location.reload();
          },
          (error: any) => {
            console.error('Error deleting room:', error);
          }
        );
      }
    });
  }

  private isRoomWithId(room: Room): room is RoomWithId {
    return room._id !== undefined;
  }

  loadUserRole(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userRole = currentUser.role;
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getTotalDevices(): number {
    return this.rooms.reduce((total, room) => total + (room.devices?.length || 0), 0);
  }

  updateFilteredRooms(): void {
    if (!this.searchTerm) {
      this.filteredRooms = this.rooms;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredRooms = this.rooms.filter(room => 
      room.name.toLowerCase().includes(searchTermLower) ||
      (room.description && room.description.toLowerCase().includes(searchTermLower))
    );
  }

  ngDoCheck(): void {
    this.updateFilteredRooms();
  }

  viewDevices(roomId: string): void {
    this.router.navigate(['/client/rooms', roomId, 'devices']);
  }

  viewDeviceGraph(deviceId: string): void {
    this.router.navigate(['/client/data-graph', deviceId]);
  }

  getDeviceId(device: string | Device): string {
    if (typeof device === 'string') {
      return device;
    }
    return device._id || '';
  }

  getDevices(room: Room): any[] {
    return room.devices || [];
  }
}

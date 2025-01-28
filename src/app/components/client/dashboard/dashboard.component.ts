import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Installation } from '../../../core/models/installation';
import { DeleteInstallationComponent } from './installation/delete-installation/delete-installation.component';
import { EditInstallationComponent } from './installation/edit-installation/edit-installation.component';
import { MatDialog } from '@angular/material/dialog';
import { AddInstallationComponent } from './installation/add-installation/add-installation.component';
import { InstallationService } from '../../../core/services/installation.service';
import { DeviceService } from '../../../core/services/device.service';
import { AsideComponent } from '../../../shared/aside/aside.component';
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-dashboard',
  imports: [MatMenuTrigger, MatMenuItem, CommonModule, MatIconModule, RouterModule, AsideComponent, EditInstallationComponent, FormsModule, MatMenu],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  installations: any[] = [];
  filteredInstallations: any[] = [];
  searchTerm: string = '';
  installationId: string | null = null;

  constructor(
    private installationService: InstallationService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.installationService.getInstallations().subscribe(
      (data) => {
        console.log('Installations data:', data);
        this.installations = data;
        this.filteredInstallations = data;
  
        // Charger les rooms pour chaque installation
        this.installations.forEach(installation => {
          this.installationService.getRoomsByInstallation(installation._id).subscribe(
            (rooms) => {
              console.log(`Rooms for installation ${installation._id}:`, rooms);
              installation.rooms = rooms; // Ajoute les rooms à l'installation
            },
            (error) => {
              console.error(`Error fetching rooms for installation ${installation._id}:`, error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching installations:', error);
      }
    );
  }
  

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInstallations = this.installations;
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredInstallations = this.installations.filter(installation => 
      installation.name.toLowerCase().includes(searchTermLower) ||
      installation.parent.toLowerCase().includes(searchTermLower)
    );
  }

  goToInstallationRooms(installationId: string): void {
    console.log('Navigating to rooms for installation ID:', installationId);
    this.installationId = installationId;
    // Set the installation ID in the device service
    this.deviceService.setInstallationId(installationId);
    this.router.navigate(['/client/installations', installationId, 'rooms']);
  }
  
  openDeleteDialog(installation: Installation): void {
    console.log('Attempting to open delete dialog:', installation);
    if (!installation || !installation._id) {
      console.error('Invalid installation:', installation);
      return;
    }

    const dialogRef = this.dialog.open(DeleteInstallationComponent, {
      data: installation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.installationService.deleteInstallation(installation._id).subscribe(
          () => {
            console.log('Delete operation completed successfully');
            this.refreshInstallations();
          },
          (error) => {
            console.error('Error deleting installation:', error);
          }
        );
      }
    });
  }

  refreshInstallations(): void {
    this.installationService.getInstallations().subscribe(
      (data) => {
        console.log('Installations refreshed:', data);
        this.installations = data;
        this.onSearch(); // Re-apply current search filter
      },
      (error) => {
        console.error('Error refreshing installations:', error);
      }
    );
  }

  openEditDialog(installation: Installation): void {
    if (!installation || !installation._id) {
      console.error('Invalid installation:', installation);
      return;
    }
    
    const dialogRef = this.dialog.open(EditInstallationComponent, {
      data: installation
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.installationService.updateInstallation(installation._id, result).subscribe(
          (updatedInstallation) => {
            console.log('Installation updated successfully:', updatedInstallation);
            this.refreshInstallations();
          },
          (error) => {
            console.error('Error updating installation:', error);
          }
        );
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddInstallationComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Installation added:', result);
      }
    });
  }

  signOut() {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }
}

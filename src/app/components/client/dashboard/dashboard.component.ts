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
  imports: [
    MatMenuTrigger, 
    MatMenuItem, 
    CommonModule, 
    MatIconModule, 
    RouterModule, 
    AsideComponent, 
    EditInstallationComponent, 
    AddInstallationComponent, 
    DeleteInstallationComponent, 
    FormsModule, 
    MatMenu
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  installations: any[] = [];
  filteredInstallations: any[] = [];
  rootInstallations: any[] = []; // Installations with parent='ROOT'
  childInstallations: { [key: string]: any[] } = {}; // Installations grouped by parent
  searchTerm: string = '';
  installationId: string | null = null;
  userRole: string = 'user';

  constructor(
    private installationService: InstallationService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadInstallations();
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

  loadInstallations(): void {
    this.installationService.getInstallations().subscribe(
      (data) => {
        console.log('Installations data:', data);
        this.installations = data;
        
        // Group installations by parent
        this.rootInstallations = [];
        this.childInstallations = {};
        
        // First pass: identify root installations and create child installation map
        this.installations.forEach(installation => {
          console.log(`Processing installation: ${installation.name}, parent: ${installation.parent}`);
          
          if (installation.parent === 'ROOT') {
            console.log(`Adding ${installation.name} as root installation`);
            this.rootInstallations.push(installation);
          } else {
            console.log(`Adding ${installation.name} as child of ${installation.parent}`);
            if (!this.childInstallations[installation.parent]) {
              this.childInstallations[installation.parent] = [];
            }
            this.childInstallations[installation.parent].push(installation);
          }
          
          // Initialize rooms array if not present
          if (!installation.rooms) {
            installation.rooms = [];
          }
        });
        
        // Second pass: add child installations to their parent's childInstallations array
        this.rootInstallations.forEach(rootInstallation => {
          console.log(`Setting up children for root installation: ${rootInstallation.name}`);
          rootInstallation.childInstallations = this.childInstallations[rootInstallation._id] || [];
          console.log(`${rootInstallation.name} has ${rootInstallation.childInstallations.length} child installations`);
        });
        
        console.log('Root installations:', this.rootInstallations);
        console.log('Child installations:', this.childInstallations);
        
        this.filteredInstallations = this.rootInstallations;
  
        // Load rooms for each installation
        this.installations.forEach(installation => {
          this.installationService.getRoomsByInstallation(installation._id).subscribe(
            (rooms) => {
              console.log(`Rooms for installation ${installation._id} (${installation.name}):`, rooms);
              installation.rooms = rooms; // Add rooms to the installation
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
      this.filteredInstallations = this.rootInstallations;
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    // Filter root installations
    this.filteredInstallations = this.rootInstallations.filter(installation => 
      (installation.name && installation.name.toLowerCase().includes(searchTermLower)) ||
      (installation.cluster && installation.cluster.toLowerCase().includes(searchTermLower))
    );
    
    // Also include root installations that have matching child installations
    this.rootInstallations.forEach(rootInstallation => {
      const childInstallations = this.childInstallations[rootInstallation._id] || [];
      const hasMatchingChild = childInstallations.some(child => 
        (child.name && child.name.toLowerCase().includes(searchTermLower)) ||
        (child.cluster && child.cluster.toLowerCase().includes(searchTermLower))
      );
      
      if (hasMatchingChild && !this.filteredInstallations.includes(rootInstallation)) {
        this.filteredInstallations.push(rootInstallation);
      }
    });
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
        
        // Group installations by parent
        this.rootInstallations = [];
        this.childInstallations = {};
        
        // First pass: identify root installations and create child installation map
        this.installations.forEach(installation => {
          console.log(`Refresh - Processing installation: ${installation.name}, parent: ${installation.parent}`);
          
          if (installation.parent === 'ROOT') {
            console.log(`Refresh - Adding ${installation.name} as root installation`);
            this.rootInstallations.push(installation);
          } else {
            console.log(`Refresh - Adding ${installation.name} as child of ${installation.parent}`);
            if (!this.childInstallations[installation.parent]) {
              this.childInstallations[installation.parent] = [];
            }
            this.childInstallations[installation.parent].push(installation);
          }
          
          // Initialize rooms array if not present
          if (!installation.rooms) {
            installation.rooms = [];
          }
        });
        
        // Second pass: add child installations to their parent's childInstallations array
        this.rootInstallations.forEach(rootInstallation => {
          console.log(`Refresh - Setting up children for root installation: ${rootInstallation.name}`);
          rootInstallation.childInstallations = this.childInstallations[rootInstallation._id] || [];
          console.log(`Refresh - ${rootInstallation.name} has ${rootInstallation.childInstallations.length} child installations`);
        });
        
        console.log('Refresh - Root installations:', this.rootInstallations);
        console.log('Refresh - Child installations:', this.childInstallations);
        
        this.filteredInstallations = this.rootInstallations;
        
        // Reload rooms for each installation
        this.installations.forEach(installation => {
          this.installationService.getRoomsByInstallation(installation._id).subscribe(
            (rooms) => {
              console.log(`Refresh - Rooms for installation ${installation._id} (${installation.name}):`, rooms);
              installation.rooms = rooms; // Add rooms to the installation
            },
            (error) => {
              console.error(`Error fetching rooms for installation ${installation._id}:`, error);
            }
          );
        });
        
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
        this.refreshInstallations(); // Rafraîchir la liste après l'ajout
      }
    });
  }

  signOut() {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }

  canEditInstallation(installation: Installation): boolean {
    if (this.isAdmin()) return true;
    const currentUser = this.authService.getCurrentUser();
    return currentUser !== null && installation.userId === currentUser._id;
  }

  canDeleteInstallation(): boolean {
    return this.isAdmin();
  }
}

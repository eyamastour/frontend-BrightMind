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
import { AsideComponent } from '../../../shared/aside/aside.component';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, RouterModule, AsideComponent, EditInstallationComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  installations: any[] = [];
  filteredInstallations: any[] = [];
  searchTerm: string = '';
  installationId: string | null = null;
    constructor(private installationService: InstallationService,private dialog: MatDialog,private router: Router, private authService: AuthService,private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.installationService.getInstallations().subscribe(
        (data) => {
          console.log('Installations data:', data);
          data.forEach((installation, index) => {
            console.log(`Installation ${index}:`, installation);
          });
          this.installations = data;
          this.filteredInstallations = data;
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
    
    
  
goToInstallationDetails(installationId: string): void {
  if (installationId) {
    this.router.navigate(['/client/areas', installationId]);
  } else {
    console.error('Installation ID is undefined or null');
  }
}

    
openDeleteDialog(installationId: string): void {
  console.log('Attempting to open delete dialog with ID:', installationId);
  if (!installationId) {
    console.error('Invalid or undefined installation ID:', installationId);
    return;
  }

  const dialogRef = this.dialog.open(DeleteInstallationComponent, {
    data: { installationId: installationId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Delete operation completed successfully');
      this.refreshInstallations(); 
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



  openEditDialog(installation: any): void {
    const dialogRef = this.dialog.open(EditInstallationComponent, {
      data: { installation }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Installation updated:', result);
        this.refreshInstallations();
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
  onLogout() {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }
}

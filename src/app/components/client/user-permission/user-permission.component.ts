import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/UserService';
import { InstallationService } from '../../../core/services/installation.service';
import { MainLayoutComponent } from '../../../shared/layout/main-layout/main-layout.component';
import { AsideComponent } from '../../../shared/aside/aside.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-permission',
  standalone: true,
  imports: [
    MatMenu, 
    MatMenuTrigger, 
    MatMenuItem, 
    CommonModule, 
    MatIconModule, 
    MainLayoutComponent, 
    AsideComponent, 
    MatSelectModule, 
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
  users: any[] = [];
  installations: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  availableRoles = ['user', 'admin'];
  selectedUser: any = null;
  selectedInstallation: string = '';

  constructor(
    private userService: UserService, 
    private installationService: InstallationService,
    private router: Router, 
    private authService: AuthService
  ) {}

  updateUserRole(user: any, newRole: string) {
    this.userService.updateUserRole(user._id, newRole).subscribe({
      next: (response) => {
        user.role = response.user.role; // Mettre à jour avec le rôle renvoyé par le serveur
        // Optionnel : ajouter une notification de succès
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        this.error = 'Erreur lors de la mise à jour du rôle';
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadInstallations();
  }

  private loadUsers(): void {
    this.userService.getUsersWithPermissions().subscribe({
      next: (response) => {
        this.users = response.users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  private loadInstallations(): void {
    this.installationService.getInstallations().subscribe({
      next: (installations) => {
        this.installations = installations;
      },
      error: (error) => {
        console.error('Error loading installations:', error);
        this.error = 'Erreur lors du chargement des installations';
      }
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  hasPermission(user: any, installationId: string): boolean {
    return user.installationPermissions && 
           user.installationPermissions.some((permission: any) => 
             permission._id === installationId || permission === installationId
           );
  }

  addPermission(): void {
    if (!this.selectedUser || !this.selectedInstallation) {
      this.error = 'Veuillez sélectionner un utilisateur et une installation';
      return;
    }

    this.userService.addInstallationPermission(this.selectedUser._id, this.selectedInstallation).subscribe({
      next: (response) => {
        // Update the user's permissions in the local array
        const userIndex = this.users.findIndex(u => u._id === this.selectedUser._id);
        if (userIndex !== -1) {
          // Find the installation object
          const installation = this.installations.find(i => i._id === this.selectedInstallation);
          
          if (!this.users[userIndex].installationPermissions) {
            this.users[userIndex].installationPermissions = [];
          }
          
          this.users[userIndex].installationPermissions.push(installation);
        }
        
        this.selectedInstallation = '';
        this.error = null;
      },
      error: (error) => {
        console.error('Error adding permission:', error);
        this.error = 'Erreur lors de l\'ajout de la permission';
      }
    });
  }

  removePermission(user: any, installationId: string): void {
    this.userService.removeInstallationPermission(user._id, installationId).subscribe({
      next: (response) => {
        // Update the user's permissions in the local array
        const userIndex = this.users.findIndex(u => u._id === user._id);
        if (userIndex !== -1) {
          this.users[userIndex].installationPermissions = this.users[userIndex].installationPermissions.filter(
            (permission: any) => permission._id !== installationId && permission !== installationId
          );
        }
      },
      error: (error) => {
        console.error('Error removing permission:', error);
        this.error = 'Erreur lors de la suppression de la permission';
      }
    });
  }

  getInstallationName(installationId: string): string {
    const installation = this.installations.find(i => i._id === installationId);
    return installation ? installation.name : 'Unknown';
  }

  signOut() {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }
}

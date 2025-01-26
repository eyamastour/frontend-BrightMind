import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/UserService';
import { MainLayoutComponent } from '../../../shared/layout/main-layout/main-layout.component';
import { AsideComponent } from '../../../shared/aside/aside.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-permission',
  standalone: true,
  imports: [MatMenu, MatMenuTrigger, MatMenuItem, CommonModule, MatIconModule, MainLayoutComponent, AsideComponent, MatSelectModule, FormsModule],
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  availableRoles = ['user', 'admin'];

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

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
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }
  signOut() {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }

}

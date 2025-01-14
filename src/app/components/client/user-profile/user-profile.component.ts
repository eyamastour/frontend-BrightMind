import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.models';  
import { AuthService } from '../../../core/services/auth'; 
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsideComponent } from '../../../shared/aside/aside.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    AsideComponent
  ],
  templateUrl: 'src/app/components/client/user-profile/user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user!: User;
  profileImage = 'assets/avatar.png';
  lastUpdateDate: string = new Date().toLocaleDateString();
  userConnected: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userConnected = this.authService.getCurrentUser();
    if (this.userConnected) {
      this.user = { ...this.userConnected };
    }
  }


  saveProfile(): void {
    if (this.user) {
      console.log('Profile saved', this.user);
      // TODO: Implement actual profile update
      this.authService.saveCurrentUser(this.user);
      this.lastUpdateDate = new Date().toLocaleDateString();
    }
  }
}

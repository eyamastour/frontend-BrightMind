import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-aside',
  imports: [MatIconModule, RouterModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  constructor(private router: Router, private authService: AuthService,private route: ActivatedRoute) {}
  onLogout() {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }
}

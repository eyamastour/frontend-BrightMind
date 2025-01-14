import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AreaComponent } from './dashboard/area/area.component';
import { LoginComponent } from '../authentification/login/login.component';
import { AddAreaComponent } from './dashboard/area/add-area/add-area.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AreasZoneComponent } from './dashboard/areas-zone/areas-zone.component';

export const ClientRouting: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protège cette route
  },
  {
    path: 'areas-zone/:installationId',
    component: AreasZoneComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'areas/:installationId',
    component: AreaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-device/:installationId',
    component: AddAreaComponent
  },

  { path: 'profil', component: UserProfileComponent },


  { path: 'login', component: LoginComponent },
];

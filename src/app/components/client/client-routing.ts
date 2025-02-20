import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AreaComponent } from './dashboard/area/area.component';
import { LoginComponent } from '../authentification/login/login.component';
import { AddAreaComponent } from './dashboard/area/add-area/add-area.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AreasZoneComponent } from './dashboard/areas-zone/areas-zone.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { InstallationRoomsComponent } from './dashboard/installation-rooms/installation-rooms.component';
import { RoomDevicesComponent } from './dashboard/room-devices/room-devices.component';
import { DataGraphComponent } from './dashboard/data-graph/data-graph.component';

export const ClientRouting: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent  },
    { 
      path: 'installations/:installationId/rooms', 
      component: InstallationRoomsComponent,
      canActivate: [AuthGuard]
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
  { path: 'permissions', component: UserPermissionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { 
    path: 'rooms/:roomId/devices', 
    component: RoomDevicesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'data-graph/:deviceId',
    component: DataGraphComponent,
    canActivate: [AuthGuard]
  }
];

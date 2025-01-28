import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Device } from '../models/device.model';
import { DeviceHistory } from '../models/device-history.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private baseUrl = 'http://localhost:3001/api';
  private installationIdSource = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}
  installationId$ = this.installationIdSource.asObservable();

  setInstallationId(id: string): void {
    this.installationIdSource.next(id);
  }

  getInstallationId(): string | null {
    return this.installationIdSource.value;
  }
  getDevicesByInstallation(installationId: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}/installations/${installationId}/devices`);
  }

  getDevicesByRoom(roomId: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}/devices/rooms/${roomId}/devices`);
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}/devices`);
  }

  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(`${this.baseUrl}/devices`, device);
  }

  deleteDevice(deviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/devices/${deviceId}`);
  }

  updateDevice(deviceId: string, updates: Partial<Device> & { triggerAlarm?: boolean }): Observable<Device> {
    return this.http.put<Device>(`${this.baseUrl}/devices/${deviceId}`, updates);
  }

  getDeviceHistory(deviceId: string, days: number = 7): Observable<DeviceHistory[]> {
    return this.http.get<DeviceHistory[]>(`${this.baseUrl}/devices/${deviceId}/history?days=${days}`);
  }

  getInstallationDevicesHistory(installationId: string, days: number = 7): Observable<DeviceHistory[]> {
    return this.http.get<DeviceHistory[]>(`${this.baseUrl}/installations/${installationId}/devices/history?days=${days}`);
  }
}

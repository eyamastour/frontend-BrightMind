import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:3001/api/devices'; // Update with your API endpoint
private url='http://localhost:3001/api'
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
    return this.http.get<Device[]>(`${this.url}/installations/${installationId}/devices`);
  }

  getDevicesByRoom(roomId: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.url}/devices/rooms/${roomId}/devices`);
  }
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }
  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}`, device);
  }
  deleteDevice(deviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${deviceId}`);
  }

  updateDevice(deviceId: string, updates: Partial<Device> & { triggerAlarm?: boolean }): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${deviceId}`, updates);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:3001/api/rooms';
  private url = 'http://localhost:3001/api';
  private installationIdSource = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}
  
  installationId$ = this.installationIdSource.asObservable();

  setInstallationId(id: string): void {
    this.installationIdSource.next(id);
  }

  getInstallationId(): string | null {
    return this.installationIdSource.value;
  }

  // Get all rooms
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  // Get rooms by installation
  getRoomsByInstallation(installationId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.url}/installations/${installationId}/rooms`);
  }

  // Get a single room
  getRoom(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${roomId}`);
  }

  // Create a new room
  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  // Update a room
  updateRoom(roomId: string, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${roomId}`, room);
  }

  // Delete a room
  deleteRoom(roomId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roomId}`);
  }

  // Add device to room
  addDeviceToRoom(roomId: string, deviceId: string): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/${roomId}/devices`, { deviceId });
  }

  // Remove device from room
  removeDeviceFromRoom(roomId: string, deviceId: string): Observable<Room> {
    return this.http.delete<Room>(`${this.apiUrl}/${roomId}/devices`, { 
      body: { deviceId } 
    });
  }
}

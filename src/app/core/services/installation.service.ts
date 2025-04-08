import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Installation } from '../models/installation';
import { Room } from '../models/room.model';

interface RoomResponse {
    _id: string;
    name: string;
    description?: string;
    installation: string;
    devices: string[];
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root',
})
export class InstallationService {
    private apiUrl = 'http://localhost:3001/api/installations';

    constructor(private http: HttpClient) {}

    getInstallations(): Observable<Installation[]> {
        // This will return all installations for admin users
        // and only installations the user has permission for if they're a regular user
        return this.http.get<Installation[]>(this.apiUrl);
    }

    getInstallationById(id: string): Observable<Installation> {
        return this.http.get<Installation>(`${this.apiUrl}/${id}`);
    }



    addInstallation(installation: Partial<Installation>): Observable<Installation> {
        console.log('Adding installation with parent:', installation.parent);
        return this.http.post<Installation>(this.apiUrl, installation).pipe(
            tap(response => console.log('Installation added, response:', response))
        );
    }

    uploadPlanImage(installationId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('planImage', file);
        
        return this.http.post<any>(`${this.apiUrl}/${installationId}/upload-plan`, formData).pipe(
            tap(response => console.log('Plan image uploaded, response:', response))
        );
    }

    updateInstallation(id: string, installation: Partial<Installation>): Observable<Installation> {
        return this.http.put<Installation>(`${this.apiUrl}/${id}`, installation);
    }

    deleteInstallation(installationId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${installationId}`);
    }
    getRoomsByInstallation(installationId: string): Observable<Room[]> {
        return this.http.get<Room[]>(`${this.apiUrl}/${installationId}/rooms`);
    }

    createRoom(room: Partial<Room>): Observable<Room> {
        return this.http.post<Room>('http://localhost:3001/api/rooms', room);
    }

    updateRoom(roomId: string, room: Partial<Room>): Observable<Room> {
        return this.http.put<Room>(`http://localhost:3001/api/rooms/${roomId}`, room);
    }

    deleteRoom(roomId: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:3001/api/rooms/${roomId}`);
    }
}

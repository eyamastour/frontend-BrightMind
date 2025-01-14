import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Installation } from '../models/installation';
import { Room } from '../models/room.model';

@Injectable({
    providedIn: 'root',
})
export class InstallationService {
    private apiUrl = 'http://localhost:3001/api/installations';

    constructor(private http: HttpClient) {}

    getInstallations(): Observable<Installation[]> {
        return this.http.get<Installation[]>(this.apiUrl);
    }

    getInstallationById(id: string): Observable<Installation> {
        return this.http.get<Installation>(`${this.apiUrl}/${id}`);
    }

    getRoomsByInstallation(installationId: string): Observable<Room[]> {
        return this.http.get<Room[]>(`${this.apiUrl}/${installationId}/rooms`);
    }

    addInstallation(installation: Partial<Installation>): Observable<Installation> {
        return this.http.post<Installation>(this.apiUrl, installation);
    }

    updateInstallation(id: string, installation: Partial<Installation>): Observable<Installation> {
        return this.http.put<Installation>(`${this.apiUrl}/${id}`, installation);
    }

    deleteInstallation(installationId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${installationId}`);
    }
}

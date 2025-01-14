import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:3001/user';
    private adminUrl = 'http://localhost:3001/admin/users';
  constructor(private http: HttpClient) { }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, data);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.adminUrl);
  }

  addUserPermission(installationId: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/permission`, { installationId, email });
  }
}

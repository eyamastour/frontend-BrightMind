import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:3001/user';
    private adminUrl = 'http://localhost:3001/admin/users';
    private roleUrl = 'http://localhost:3001/admin/user';

  constructor(private http: HttpClient) { }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reset-password?token=${token}`);
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password/${token}`, { newPassword });
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, data);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.adminUrl);
  }

  addUserPermission(installationId: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/permission`, { installationId, email });
  }

  updateUser(userId: string, userData: any): Observable<any> {
    if (userData.hasOwnProperty('role')) {
      return this.http.put<any>(`${this.adminUrl}/${userId}`, { role: userData.role });
    }
    return this.http.put<any>(`${this.adminUrl}/${userId}`, userData);
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put<any>(`${this.roleUrl}/${userId}/role`, { role });
  }
}

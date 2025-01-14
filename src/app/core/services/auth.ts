import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';  // Import pour l'opérateur tap
import { User } from '../models/user.models';
import { AuthentificationConstant } from '../../components/authentification/authentification.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/user'; // URL du backend
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  // Méthode de connexion
  login(email: string, password: string, rememberMe: boolean = false): Observable<any> {
    const loginData = { email, password };
  
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        if (response.token) {
          this.saveToken(response.token); // Sauvegarde le token
          this.saveCurrentUser(response.user); // Sauvegarde l'utilisateur
        }
      }),
      catchError(this.handleError) // Gestion des erreurs
    );
  }
  

  // Sauvegarder le token dans le localStorage
  saveToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    this.tokenSubject.next(token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log("Token retrieved:", token);  // Log du token
    if (!token) {
      return false;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décodage du token
      const isExpired = payload.exp * 1000 < Date.now(); // Vérification de l'expiration
      console.log("Token expired:", isExpired); // Log si le token est expiré
      return !isExpired;
    } catch (e) {
      console.error("Invalid token format:", e);  // Log d'erreur si le token est invalide
      return false;
    }
  }
  
  
  
  // Méthode pour se déconnecter
  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.tokenSubject.next(null);  // Mise à jour de l'état de l'authentification
  }

  // Gestionnaire d'erreurs
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }

   // Sauvegarder l'utilisateur dans le localStorage
   saveCurrentUser(user: User): void {
    localStorage.setItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE, JSON.stringify(user));
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === 'admin';
  }
}

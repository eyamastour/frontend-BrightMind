import { Routes } from '@angular/router';
import { AuthentificationRoutes } from './components/authentification/authentification-routing';
import { ClientRouting } from './components/client/client-routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',  // Redirige directement vers la page de login
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: AuthentificationRoutes,  // Définir les routes d'authentification comme login et signup
  },
  {
    path: 'client',
    children: ClientRouting,  // Définir les routes protégées sous 'client'
  },
  // Route pour gérer les routes inconnues
  {
    path: '**',
    redirectTo: 'auth/login',  // Redirection vers la page de login en cas de route inconnue
  },
];

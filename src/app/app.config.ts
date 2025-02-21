import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import { provideRouter, withPreloading, withViewTransitions } from "@angular/router";
import {provideToastr} from "ngx-toastr";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {HttpClientModule, provideHttpClient, withInterceptors, HttpInterceptorFn} from "@angular/common/http";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import {provideNativeDateAdapter} from "@angular/material/core";
import {routes} from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
    provideHttpClient(withInterceptors([(req, next) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('Token being used:', token);
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Request with Authorization header:', req);
      }
      return next(req);
    }])),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideAnimationsAsync(),
    provideToastr(),
    provideNativeDateAdapter(),
    provideAnimationsAsync()
  ],
};

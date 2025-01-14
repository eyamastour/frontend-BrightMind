import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import { provideRouter, withPreloading, withViewTransitions } from "@angular/router";
import {provideToastr} from "ngx-toastr";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {HttpClientModule,  withInterceptors} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";
import {routes} from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule), // Ajoutez BrowserAnimationsModule ici
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),    provideAnimationsAsync(),provideToastr(),provideNativeDateAdapter(), provideAnimationsAsync()],
};

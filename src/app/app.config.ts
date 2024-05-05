import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DashboardService } from './services/DashboardServices/dashboard.service';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { errorInterceptorInterceptor } from './interceptors/error-interceptor.interceptor';
import { GlobalErrorHandler } from './GlobalErrorHandler';
import { cachingInterceptor } from './interceptors/caching.interceptor';
import { ErrorLoggingService } from './services/ErrorLogging/error-logging.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        cachingInterceptor,
        errorInterceptorInterceptor,
      ])
    ),
    provideAnimationsAsync('noop'),
    DashboardService,
    [{ useClass: DashboardService }],
    provideAnimations(),
    provideToastr(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};

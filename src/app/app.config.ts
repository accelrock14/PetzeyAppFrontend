import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService } from './services/DashboardServices/dashboard.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync('noop'), DashboardService,
    [
      {useClass: DashboardService}
    ]
  ]
};

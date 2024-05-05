import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, throwError } from 'rxjs';
import {
  ErrorLoggingService,
  HttpLogData,
} from '../services/ErrorLogging/error-logging.service';

export const errorInterceptorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const errorLoggignService = inject(ErrorLoggingService);
  return next(req).pipe(
    catchError((error) => {
      console.log('caught error in http interceptor:- ' + error.message);
      var dataToLog: HttpLogData = {
        errorMessage: error.message,
        statusCode: error.status,
        error: error,
        date: new Date(),
      };
      errorLoggignService.logError(dataToLog);
      return throwError(() => error);
    })
  );
};

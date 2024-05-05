import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, catchError, throwError } from 'rxjs';

export const errorInterceptorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error) => {
      console.log('caught error in http interceptor:- ' + error.message);
      return throwError(() => error);
    })
  );
};

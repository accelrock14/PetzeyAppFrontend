import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/UserAuthServices/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/errologs.json')) {
    return next(req);
  }
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};

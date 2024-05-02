import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/UserAuthServices/auth.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;
  else return false;
};

import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/UserAuthServices/auth.service';
import { inject } from '@angular/core';

export const ownerGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService)
  let role = auth.getRoleFromToken();
  if(role === "Owner") return true;
  else return false;
};

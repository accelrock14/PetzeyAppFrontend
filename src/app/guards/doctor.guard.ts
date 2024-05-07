import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/UserAuthServices/auth.service';
import { inject } from '@angular/core';

export const doctorGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService)
  let role = auth.getRoleFromToken();
  if(role === "Doctor") return true;
  else return false;
};

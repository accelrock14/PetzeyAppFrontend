import { CanActivateFn } from '@angular/router';

export const receptionistGuard: CanActivateFn = (route, state) => {
  return true;
};

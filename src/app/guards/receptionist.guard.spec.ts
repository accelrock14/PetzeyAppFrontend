import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { receptionistGuard } from './receptionist.guard';

describe('receptionistGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => receptionistGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

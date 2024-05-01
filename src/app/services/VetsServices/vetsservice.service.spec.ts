import { TestBed } from '@angular/core/testing';

import { VetsserviceService } from './vetsservice.service';

describe('VetsserviceService', () => {
  let service: VetsserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VetsserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

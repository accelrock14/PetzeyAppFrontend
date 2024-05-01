import { TestBed } from '@angular/core/testing';

import { AppointmentDetailsService } from './appointment-details.service';

describe('AppointmentDetailsService', () => {
  let service: AppointmentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

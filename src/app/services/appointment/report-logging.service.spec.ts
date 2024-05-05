import { TestBed } from '@angular/core/testing';

import { ReportLoggingService } from './report-logging.service';

describe('ReportLoggingService', () => {
  let service: ReportLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportLoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PetsPaginatorIntlService } from './pets-paginator-intl.service';

describe('PetsPaginatorIntlService', () => {
  let service: PetsPaginatorIntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetsPaginatorIntlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CryptoJSServiceService } from './crypto-jsservice.service';

describe('CryptoJSServiceService', () => {
  let service: CryptoJSServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoJSServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

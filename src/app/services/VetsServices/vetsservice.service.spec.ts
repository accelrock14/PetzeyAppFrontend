import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VetsserviceService } from './vetsservice.service';

describe('VetsserviceService', () => {
  let service: VetsserviceService;
  describe('VetsserviceService', () => {
    let service: VetsserviceService;
    let httpMock: HttpTestingController;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [VetsserviceService]
      });
  
      service = TestBed.inject(VetsserviceService);
      httpMock = TestBed.inject(HttpTestingController);
    });
  
    afterEach(() => {
      httpMock.verify(); // Verify that no unmatched requests are outstanding.
    });
})

// it('should retrieve all vets via GET', () => {
//   const dummyVets = [
//     { id: 1, name: 'Dr. Jane' },
//     { id: 2, name: 'Dr. John' }
//   ];

//   service.getAllVets().subscribe(vets => {
//     expect(vets.length).toBe(2);
//     expect(vets).toEqual(dummyVets);
//   });

//   const request = httpMock.expectOne(`${service.apiUrl}`);
//   expect(request.request.method).toBe('GET');
//   request.flush(dummyVets);
// });
});


import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentFormService } from './appointment-form.service';
import { PetsService } from '../PetsServices/pets.service';
import { VetsserviceService } from '../VetsServices/vetsservice.service';
import { AuthService } from '../UserAuthServices/auth.service';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { IVetCardDTO } from '../../models/Vets/IVetCardDto';
import { appointmentServiceUrl } from '../../Shared/apiUrls';

describe('AppointmentFormService', () => {
  let service: AppointmentFormService;
  let httpTestingController: HttpTestingController;
  let mockPetsService: jasmine.SpyObj<PetsService>;
  let mockVetService: jasmine.SpyObj<VetsserviceService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create spy objects with methods you expect to call
    mockPetsService = jasmine.createSpyObj('PetsService', ['GetPetsByParentID']);
    mockVetService = jasmine.createSpyObj('VetsserviceService', ['getAllVets', 'getVetsByNPINumber']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getVPIFromToken', 'getUIDFromToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppointmentFormService,
        { provide: PetsService, useValue: mockPetsService },
        { provide: VetsserviceService, useValue: mockVetService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    service = TestBed.inject(AppointmentFormService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch general pet issues as an Observable', () => {
    const dummyIssues: GeneralPetIssue[] = [
      {
        IssueName: 'Fever',
        GeneralPetIssueID: 0
      },
      {
        IssueName: 'Cold',
        GeneralPetIssueID: 0
      }
    ];

    service.getGeneralPetIssues().subscribe(issues => {
      expect(issues.length).toBe(2);
      expect(issues).toEqual(dummyIssues);
    });

    const req = httpTestingController.expectOne(appointmentServiceUrl+"api/AppointmentDetails/GeneralPetIssues");
    expect(req.request.method).toBe('GET');
    req.flush(dummyIssues);
  });

  it('should post an appointment and return it', () => {
    const dummyAppointment: AppointmentDetail = {
      AppointmentID: 1,
      DoctorID: 'D1',
      PetID: 1,
      OwnerID: 'O1',
      ScheduleDate: new Date(),
      ScheduleTimeSlot: 2,
      BookingDate: new Date(),
      ReasonForVisit: 'Checkup',
      Status: 0,
      Report: null,
      PetIssues: []
    };

    service.postAppointment(dummyAppointment).subscribe(appointment => {
      expect(appointment).toEqual(dummyAppointment);
    });

    const req = httpTestingController.expectOne(appointmentServiceUrl+"api/Appointment");
    expect(req.request.method).toBe('POST');
    req.flush(dummyAppointment);
  });

  // Add more tests for other methods
});




//||||||||||||||||||||||||||||||||
// import { TestBed } from '@angular/core/testing';

// import { AppointmentFormService } from './appointment-form.service';

// describe('AppointmentFormService', () => {
//   let service: AppointmentFormService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(AppointmentFormService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

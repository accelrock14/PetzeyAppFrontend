import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { FilterParamsDto } from '../../models/Dashboard/FilterParamsDto';
import { AppointmentCardDto } from '../../models/Appointment/AppointmentCardDto';
import { AppointmentStatusCountsDto } from '../../models/Dashboard/AppointmentStatusCountsDto';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all appointments with filters', () => {
    const filters: FilterParamsDto = {
      ScheduleDate: null,
      Status: '',
      DoctorID: ""
    };
    const offset = 0;
    const dummyAppointments: AppointmentCardDto[] = [{
      AppointmentID: 1, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Smith',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    },
    {
      AppointmentID: 2, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Johnson',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    }];

    service.GetAllAppointmentsWithFilters(filters, offset).subscribe(appointments => {
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/api/dashboard/appointments/filter/${offset}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);
    req.flush(dummyAppointments);
  });

  // it('should get status counts', () => {
  //   const vetid = '123'; // Mock vet ID
  //   const dummyStatusCounts: AppointmentStatusCountsDto = { Pending:0, Confirmed: 4, Total: 5, Cancelled: 1, Closed: 0 };

  //   service.GetStatusCounts(vetid).subscribe(statusCounts => {
  //     expect(statusCounts).toEqual(dummyStatusCounts);
  //   });

  //   const req = httpMock.expectOne(`${service.apiUrl}/api/dashboard/statuscounts/${vetid}`);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(dummyStatusCounts);
  // });

  it('should get patient appointments with filters', () => {
    const filters: FilterParamsDto = {
      ScheduleDate: null,
      Status: '',
      DoctorID: ""
    };
    const offset = 0;
    const ownerid = '123'; // Mock owner ID
    const dummyAppointments: AppointmentCardDto[] = [{
      AppointmentID: 1, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Smith',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    },
    {
      AppointmentID: 2, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Johnson',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    }];

    service.GetPatientAppointmentsWithFilters(filters, offset, ownerid).subscribe(appointments => {
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/api/dashboard/petappointments/filter/${ownerid}/${offset}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);
    req.flush(dummyAppointments);
  });

  it('should get vet appointments with filters', () => {
    const filters: FilterParamsDto = {
      ScheduleDate: null,
      Status: '',
      DoctorID: ""
    };
    const offset = 0;
    const vetid = '123'; // Mock vet ID
    const dummyAppointments: AppointmentCardDto[] = [{
      AppointmentID: 1, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Smith',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    },
    {
      AppointmentID: 2, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Johnson',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    }]

    service.GetVetAppointmentsWithFilters(filters, offset, vetid).subscribe(appointments => {
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/api/dashboard/vetappointments/filter/${vetid}/${offset}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);
    req.flush(dummyAppointments);
  });

  it('should get all closed appointments by pet ID', () => {
    const petid = 1; // Mock pet ID
    const dummyAppointments: AppointmentCardDto[] = [{
      AppointmentID: 1, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Smith',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    },
    {
      AppointmentID: 2, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Johnson',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    }]

    service.GetAllClosedAppointmentByPetID(petid).subscribe(appointments => {
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/api/AppointmentDetails/allappointmentsbypetid/${petid}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAppointments);
  });

  it('should get all closed appointments by vet ID', () => {
    const vetid = 1; // Mock vet ID
    const dummyAppointments: AppointmentCardDto[] = [{
      AppointmentID: 1, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Smith',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    },
    {
      AppointmentID: 2, 
      ScheduleDate: new Date(), 
      DoctorName: 'Dr. Johnson',
      DoctorID: '',
      PetID: 0,
      PetName: '',
      PetAge: 0,
      PetGender: '',
      OwnerName: '',
      OwnerID: '',
      PetPhoto: '',
      VetSpecialization: 'Vaccination',
      DoctorPhoto: '',
      Status: ''
    }];

    service.GetAllClosedAppointmentByVetID(vetid).subscribe(appointments => {
      expect(appointments).toEqual(dummyAppointments);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/api/AppointmentDetails/allappointmentsbyvetid/${vetid}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAppointments);
  });
});

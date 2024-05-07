import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { FilterParamsDto } from '../../../models/Dashboard/FilterParamsDto';
import { AppointmentStatusCountsDto } from '../../../models/Dashboard/AppointmentStatusCountsDto';
import { IVet } from '../../../models/Vets/IVet';
import { IAddress } from '../../../models/Vets/IAddress';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DoctorDashboardComponent', () => {
  let component: DoctorDashboardComponent;
  let fixture: ComponentFixture<DoctorDashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  let vetService: jasmine.SpyObj<VetsserviceService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['GetVetAppointmentsWithFilters', 'GetStatusCounts']);
    const vetServiceSpy = jasmine.createSpyObj('VetsserviceService', ['getVetsByNPINumber']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getVPIFromToken']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()], // Import the module here
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: VetsserviceService, useValue: vetServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: {}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    vetService = TestBed.inject(VetsserviceService) as jasmine.SpyObj<VetsserviceService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter appointments', () => {
    // Mock data
    const mockAppointments: AppointmentCardDto[] = [{
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
    const selectedDate = new Date();
    const selectedStatus = 'Scheduled';
    const doctorIdFromNPI = 'mock-doctor-id';

    // Set up spies
    dashboardService.GetVetAppointmentsWithFilters.and.returnValue(of(mockAppointments));

    // Set component properties
    component.selectedDate = selectedDate;
    component.selectedStatus = selectedStatus;
    component.doctorIdFromNPI = doctorIdFromNPI;

    // Call method
    component.onDateStatusChange();

    // Assertions
    expect(component.loadingAppointments).toBe(false);
    expect(component.appointmentCards).toEqual(mockAppointments);
  });

  it('should disable previous page button correctly', () => {
    // Set component properties
    component.page = 1;

    // Call method
    const result = component.isPreviousPageDisabled();

    // Assertions
    expect(result).toBeTrue();
  });

  it('should disable next page button correctly', () => {
    // Mock data
    const mockAppointments: AppointmentCardDto[] = [];

    // Set component properties
    component.appointmentCards = mockAppointments;

    // Call method
    const result = component.isNextPageDisabled();

    // Assertions
    expect(result).toBeTrue();
  });

  it('should not disable next page button when appointments are present', () => {
    // Mock data
    const mockAppointments: AppointmentCardDto[] = [{
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

    // Set component properties
    component.appointmentCards = mockAppointments;

    // Call method
    const result = component.isNextPageDisabled();

    // Assertions
    expect(result).toBeFalse();
  });

  // Add more tests as needed
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PatientDashboardComponent', () => {
  let component: PatientDashboardComponent;
  let fixture: ComponentFixture<PatientDashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['GetPatientAppointmentsWithFilters']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUIDFromToken']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: {}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', fakeAsync(() => {
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
    }];
    const mockUID = 'mock-user-id';

    // Set up spies
    authService.getUIDFromToken.and.returnValue(mockUID);
    dashboardService.GetPatientAppointmentsWithFilters.and.returnValue(of(mockAppointments));

    // Call ngOnInit
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assertions
    expect(component.loadingAppointments).toBe(false);
    expect(component.appointmentCards).toEqual(mockAppointments);
  }));

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
    }];
    const selectedDate = new Date();
    const selectedStatus = 'Scheduled';
    const mockUID = 'mock-user-id';

    // Set up spies
    dashboardService.GetPatientAppointmentsWithFilters.and.returnValue(of(mockAppointments));
    authService.getUIDFromToken.and.returnValue(mockUID);

    // Set component properties
    component.selectedDate = selectedDate;
    component.selectedStatus = selectedStatus;

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
    }];

    // Set component properties
    component.appointmentCards = mockAppointments;

    // Call method
    const result = component.isNextPageDisabled();

    // Assertions
    expect(result).toBeFalse();
  });
});

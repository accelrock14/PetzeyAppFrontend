import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  let vetService: jasmine.SpyObj<VetsserviceService>;

  beforeEach(async () => {
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['GetAllAppointmentsWithFilters']);
    const vetServiceSpy = jasmine.createSpyObj('VetsserviceService', ['getVetsAndIds']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, RouterTestingModule], // Import the module here
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: VetsserviceService, useValue: vetServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    vetService = TestBed.inject(VetsserviceService) as jasmine.SpyObj<VetsserviceService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    const mockAppointments = [
      {
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
      }
    ];
    const mockDoctors = [{ VetId: 1, Name: "Dr. Smith" },{ VetId: 2, Name: "Dr. Johnson" }];

    dashboardService.GetAllAppointmentsWithFilters.and.returnValue(of(mockAppointments));
    vetService.getVetsAndIds.and.returnValue(of(mockDoctors));

    component.ngOnInit();

    expect(component.loadingAppointments).toBe(false);
    expect(component.appointmentCards).toEqual(mockAppointments);
    expect(component.doctorsList).toEqual(mockDoctors);
  });

  it('should filter appointments', () => {
    const mockAppointments = [
      {
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
      }
    ];
    const selectedDate = new Date();
    const selectedStatus = 'Scheduled';
    const selectedDoctor = 'Dr. Smith';

    dashboardService.GetAllAppointmentsWithFilters.and.returnValue(of(mockAppointments));

    component.selectedDate = selectedDate;
    component.selectedStatus = selectedStatus;
    component.selectedDoctor = selectedDoctor;
    component.onDateStatusDoctorChange();

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
    const mockAppointments: AppointmentCardDto[] = [
      {
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
      }
    ];

    // Set component properties
    component.appointmentCards = mockAppointments;

    // Call method
    const result = component.isNextPageDisabled();

    // Assertions
    expect(result).toBeFalse();
  });

});

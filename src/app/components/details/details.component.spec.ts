import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { AppointmentDetailsService } from '../../services/appointment-details.service';
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs'; // for mocking observables
import { PatientDashboardComponent } from '../dashboard/patient-dashboard/patient-dashboard.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let appointmentDetailsService: AppointmentDetailsService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsComponent ],
      providers: [
        { provide: AppointmentDetailsService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    appointmentDetailsService = TestBed.inject(AppointmentDetailsService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Role permission tests
  it('isPatient should return true for role Owner', () => {
    spyOn(authService, 'getRoleFromToken').and.returnValue('Owner');
    expect(component.isPatient()).toBeTrue();
  });

  it('isPatient should return false for other roles', () => {
    spyOn(authService, 'getRoleFromToken').and.returnValue('Doctor');
    expect(component.isPatient()).toBeFalse();
  });

  it('isDoctor should return true for role Doctor', () => {
    spyOn(authService, 'getRoleFromToken').and.returnValue('Doctor');
    expect(component.isDoctor()).toBeTrue();
  });

  it('isDoctor should return false for other roles', () => {
    spyOn(authService, 'getRoleFromToken').and.returnValue('Owner');
    expect(component.isDoctor()).toBeFalse();
  });

  it('isReceptionist should return true for role Receptionist', () => {
    spyOn(authService, 'getRoleFromToken').and.returnValue('Receptionist');
    expect(component.isReceptionist()).toBeTrue();
  });

  it('isReceptionist should return false for other roles', () => {
    spyOn(authService, 'getRoleFromToken').and.returnValue('Doctor');
    expect(component.isReceptionist()).toBeFalse();
  });

  // Tests for fetching appointment details
  // it('ngOnInit should get appointment details and doctor name if authorized', () => {
  //   const appointmentId = 1;
  //   const appointmentDetails = { AppointmentID: appointmentId };
  //   const doctorName = 'Test Doctor';
  //   spyOn(authService, 'getUIDFromToken').and.returnValue('uid');
  //   spyOn(authService, 'getVPIFromToken').and.returnValue('vpi');
  //   spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(appointmentId.toString());
  //   spyOn(appointmentDetailsService, 'GetAppointmentDetail').and.returnValue(of(appointmentDetails));
  //   spyOn(component.vetService, 'getVetById').and.returnValue(of({ FName: 'Test', LName: 'Doctor', NPINumber: 'vpi' }));

  //   component.ngOnInit();

  //   expect(appointmentDetailsService.GetAppointmentDetail).toHaveBeenCalledWith(appointmentId);
  //   expect(component.vetService.getVetById).toHaveBeenCalledWith(appointmentDetails.DoctorID);
  //   expect(component.appointment).toEqual(appointmentDetails);
  //   expect(component.DoctorName).toEqual(doctorName);
  // });

  // // Tests for unauthorized access
  // it('ngOnInit should navigate away if patient tries to view unauthorized appointment', () => {
  //   const appointmentId = 1;
  //   const appointmentDetails = { AppointmentID: appointmentId, OwnerID: 'different-uid' };
  //   spyOn(authService, 'getUIDFromToken').and.returnValue('uid');
  //   spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(appointmentId.toString());
  //   spyOn(appointmentDetailsService, 'GetAppointmentDetail').and.returnValue(of(appointment  // Tests for unauthorized access (continued)
  //   it('ngOnInit should navigate away if patient tries to view unauthorized appointment', () => {
  //     const appointmentId = 1;
  //     const appointmentDetails = { AppointmentID: appointmentId, OwnerID: 'different-uid' };
  //     spyOn(authService, 'getUIDFromToken').and.returnValue('uid');
  //     spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(appointmentId.toString());
  //     spyOn(appointmentDetailsService, 'GetAppointmentDetail').and.returnValue(of(appointmentDetails));
  //     spyOn(authService, 'getRoleFromToken').and.returnValue('Owner');
  //     spyOn(router, 'navigate');
  
  //     component.ngOnInit();
  
  //     expect(router.navigate).toHaveBeenCalledWith(['/home']);
  //   });
  
  //   // Tests for closing appointments
  //   it('closeAppointment should call service to patch appointment status and update component state', () => {
  //     const appointmentId = 1;
  //     const updatedAppointment = { ...component.appointment, Status: 3 };
  //     spyOn(component.appointmentDetailsService, 'PatchAppointmentStatus').and.returnValue(of(updatedAppointment));
  //     spyOn(component, 'closeModal');
  
  //     component.appointment.AppointmentID = appointmentId;
  //     component.closeAppointment();
  
  //     expect(component.appointmentDetailsService.PatchAppointmentStatus).toHaveBeenCalledWith(appointmentId, 3);
  //     expect(component.appointment).toEqual(updatedAppointment);
  //     expect(component.closeModal).toHaveBeenCalled();
  //   });
  
  //   // Tests for canceling appointments
  //   it('cancelAppointment should call service to patch appointment status and update component state', () => {
  //     const appointmentId = 1;
  //     const updatedAppointment = { ...component.appointment, Status: 2 };
  //     spyOn(component.appointmentDetailsService, 'PatchAppointmentStatus').and.returnValue(of(updatedAppointment));
  //     spyOn(component, 'closeModal2');
  
  //     component.appointment.AppointmentID = appointmentId;
  //     component.cancelAppointment();
  
  //     expect(component.appointmentDetailsService.PatchAppointmentStatus).toHaveBeenCalledWith(appointmentId, 2);
  //     expect(component.appointment).toEqual(updatedAppointment);
  //     expect(component.closeModal2).toHaveBeenCalled();
  //   });
  
  //   // Tests for accepting appointments (assuming a method for this exists)
  //   it('acceptAppointment should call service to patch appointment status and update component state', () => {
  //     const appointmentId = 1;
  //     const updatedAppointment = { ...component.appointment, Status: 1 };
  //     spyOn(component.appointmentDetailsService, 'PatchAppointmentStatus').and.returnValue(of(updatedAppointment));
  //     spyOn(component, 'closeModal3');
  
  //     component.appointment.AppointmentID = appointmentId;
  //     component.acceptAppointment(); // Assuming this method exists in your component
  
  //     expect(component.appointmentDetailsService.PatchAppointmentStatus).toHaveBeenCalledWith(appointmentId, 1);
  //     expect(component.appointment).toEqual(updatedAppointment);
  //     expect(component.closeModal3).toHaveBeenCalled();
  //   });
  });
  
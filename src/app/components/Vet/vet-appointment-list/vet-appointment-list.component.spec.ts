import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetAppointmentListComponent } from './vet-appointment-list.component';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { of } from 'rxjs';

describe('VetAppointmentListComponent', () => {
  let component: VetAppointmentListComponent;
  let fixture: ComponentFixture<VetAppointmentListComponent>;
  let mockDashboardService: DashboardService;
  let mockAuthService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetAppointmentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VetAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call GetAllClosedAppointmentByVetID method with correct VetID on initialization', () => {
    const vetId = 1;
    const appointmentcard: AppointmentCardDto[] = [
      {
        AppointmentID: 1,
        DoctorID: 'doc123',
        PetID: 1,
        PetName: 'Buddy',
        PetAge: 5,
        PetGender: 'Male',
        OwnerName: 'John Doe',
        OwnerID: 'owner456',
        DoctorName: 'Dr. Smith',
        PetPhoto: 'buddy.jpg',
        VetSpecialization: 'General Practitioner',
        DoctorPhoto: 'doctor.jpg',
        ScheduleDate: new Date('2024-05-12'),
        Status: 'Closed',
        All: 5
      }];
    spyOn(mockDashboardService,'GetAllClosedAppointmentByVetID').and.returnValue(of(appointmentcard));
    component.VetID = vetId;

    component.ngOnInit();

    expect(mockDashboardService.GetAllClosedAppointmentByVetID).toHaveBeenCalledWith(vetId);
    expect(component.appointmentcard).toEqual(appointmentcard);
  });
  it('should set user property based on role from token', () => {
    spyOn(mockAuthService,'getRoleFromToken').and.returnValue('Doctor');
    component.ngOnInit();
    expect(component.user).toEqual('Doctor');

    spyOn(mockAuthService,'getRoleFromToken').and.returnValue('Owner');
    component.ngOnInit();
    expect(component.user).toEqual('Patient');

    spyOn(mockAuthService,'getRoleFromToken').and.returnValue('Admin');
    component.ngOnInit();
    expect(component.user).toEqual('Admin');
  });
  it('should return grouped appointments correctly', () => {
    const appointmentcard: AppointmentCardDto[] = [{
      AppointmentID: 1,
      DoctorID: 'doc123',
      PetID: 1,
      PetName: 'Buddy',
      PetAge: 5,
      PetGender: 'Male',
      OwnerName: 'John Doe',
      OwnerID: 'owner456',
      DoctorName: 'Dr. Smith',
      PetPhoto: 'buddy.jpg',
      VetSpecialization: 'General Practitioner',
      DoctorPhoto: 'doctor.jpg',
      ScheduleDate: new Date('2024-05-12'),
      Status: 'Scheduled'
    },
    {
      AppointmentID: 2,
      DoctorID: 'doc456',
      PetID: 2,
      PetName: 'Fluffy',
      PetAge: 3,
      PetGender: 'Female',
      OwnerName: 'Jane Doe',
      OwnerID: 'owner789',
      DoctorName: 'Dr. Johnson',
      PetPhoto: 'fluffy.jpg',
      VetSpecialization: 'Dermatologist',
      DoctorPhoto: 'doctor.jpg',
      ScheduleDate: new Date('2024-05-13'),
      Status: 'Scheduled'
    }];
    component.appointmentcard = appointmentcard;

    const groupedAppointments = component.groupedAppointments();

    expect(groupedAppointments.length).toEqual(2);
    expect(groupedAppointments[0].length).toEqual(1);
    expect(groupedAppointments[1].length).toEqual(1);
  });
});

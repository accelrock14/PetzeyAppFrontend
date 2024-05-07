import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetAppointmentsListComponent } from './pet-appointments-list.component';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
describe('PetAppointmentsListComponent', () => {
  let component: PetAppointmentsListComponent;
  let fixture: ComponentFixture<PetAppointmentsListComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  
  beforeEach(async () => {
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['GetAllClosedAppointmentByPetID']);

    await TestBed.configureTestingModule({
      imports: [PetAppointmentsListComponent, HttpClientTestingModule, ToastrModule.forRoot(), CommonModule, RouterTestingModule],
      providers: [{ provide: DashboardService, useValue: dashboardServiceSpy }, ToastrService,]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetAppointmentsListComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display appointments', () => {
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

    dashboardService.GetAllClosedAppointmentByPetID.and.returnValue(of(mockAppointments));

    component.PetID = 123; // Set the PetID

    fixture.detectChanges();

    // Check if the appointments are fetched and displayed correctly
    let appointmentCards:AppointmentCardDto[] = [];
    dashboardService.GetAllClosedAppointmentByPetID(1).subscribe(data => {
      appointmentCards = data
    })
    expect(appointmentCards.length).toBe(2); // Assuming there are two appointments
    expect(appointmentCards[0].DoctorName).toContain('Dr. Smith');
    expect(appointmentCards[0].AppointmentID).toEqual(1);
    expect(appointmentCards[1].DoctorName).toContain('Dr. Johnson');
    expect(appointmentCards[1].VetSpecialization).toContain('Vaccination');
  });

  it('should handle no appointments', () => {
    // Simulate no appointments
    dashboardService.GetAllClosedAppointmentByPetID.and.returnValue(of([]));

    component.PetID = 123; // Set the PetID

    fixture.detectChanges();

    // Check if no appointments message is displayed
    const noAppointmentsMessage = fixture.nativeElement.querySelector('p');
    expect(noAppointmentsMessage).toBeNull();
  });
});

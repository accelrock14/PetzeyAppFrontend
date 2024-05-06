import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewAppointmentFormComponent } from './new-appointment-form.component';
import { AuthService } from '../../services/UserAuthServices/auth.service';
import { AppointmentFormService} from '../../services/Appointment_Form_Services/appointment-form.service';
import { VetsserviceService } from '../../services/VetsServices/vetsservice.service';
import { PetsService } from '../../services/PetsServices/pets.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { PetIssue } from '../../models/PetIssue';
describe('NewAppointmentFormComponent', () => {
  let component: NewAppointmentFormComponent;
  let fixture: ComponentFixture<NewAppointmentFormComponent>;
  let aptService: AppointmentFormService;
  let authService: AuthService;
  let vetService: VetsserviceService;
  let petService: PetsService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAppointmentFormComponent],
      imports: [RouterTestingModule, FormsModule, CommonModule],
      providers: [
        {
          provide: AppointmentFormService,
          useValue: jasmine.createSpyObj('AppointmentFormService', [
            'getGeneralPetIssues',
            'getVeternarians',
            'getScheduleSlotStatuses',
            'postAppointment',
          ]),
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [
            'isLoggedIn',
            'getRoleFromToken',
            'getUIDFromToken',
            'getVPIFromToken',
            'getAllUsers',
          ]),
        },
        {
          provide: VetsserviceService,
          useValue: jasmine.createSpyObj('VetsserviceService', ['getVetsByNPINumber']),
        },
        {
          provide: PetsService,
          useValue: jasmine.createSpyObj('PetsService', ['GetPetsByParentID']),
        },
        { provide: Location },
        
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewAppointmentFormComponent);
    component = fixture.componentInstance;
    aptService = TestBed.inject(AppointmentFormService);
    authService = TestBed.inject(AuthService);
    vetService = TestBed.inject(VetsserviceService);
    petService = TestBed.inject(PetsService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
   
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for logged in user check and role assignment on init
  it('should check if user is logged in and assign role on ngOnInit', () => {
    authService.isLoggedIn;
    authService.getRoleFromToken;

    fixture.detectChanges();

    expect(component.isOwner).toBeTrue();
    expect(component.appointmentDetail.OwnerID).toEqual(authService.getUIDFromToken());
  });

  // Test for fetching general pet issues on init (success)
  it('should get general pet issues from service on ngOnInit (success)', () => {
    const generalPetIssues = [
      { IssueName: 'Skin irritation' },
      { IssueName: 'Ear infection' },
    ];
    aptService.getGeneralPetIssues;
    //.and.returnValue(of(generalPetIssues));

    fixture.detectChanges();

    expect(aptService.getGeneralPetIssues).toHaveBeenCalled();
    // expect(component.generalPetIssues).toEqual(generalPetIssues);
    // expect(component.filteredpetIssues).toEqual(generalPetIssues);
  });

  // Test for fetching general pet issues on init (error)
  it('should handle error while fetching general pet issues on ngOnInit', () => {
    const error = new Error('Error fetching general pet issues');
    aptService.getGeneralPetIssues
    //.and.returnValue(throwError(error));

    fixture.detectChanges();

    expect(aptService.getGeneralPetIssues).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('there was an error in while fetching the generalpetissue in the appointment form ng onint', error);
  });

  it('should get pets for logged in owner on ngOnInit (owner)', () => {
    const pets = [
      { PetID: 1, PetName: 'Fluffy' },
      { PetID: 2, PetName: 'Whiskers' },
    ];
    const ownerId = '12345';
    authService.isLoggedIn;
    //.and.returnValue(true);
    authService.getRoleFromToken
    //.and.returnValue('Owner');
    authService.getUIDFromToken
    //.and.returnValue(ownerId);
    petService.GetPetsByParentID
    //.and.returnValue(of(pets));

    fixture.detectChanges();

    expect(petService.GetPetsByParentID).toHaveBeenCalledWith(ownerId);
    // expect(component.pets).toEqual(pets);
    // expect(component.filteredPets).toEqual(pets);
  });

  // Test for fetching pet parents on init (for doctor/receptionist)
  it('should get pet parents from users on ngOnInit (doctor/receptionist)', () => {
    const users = [
      { Id: 1, Name: 'John Doe', Role: 'Owner' },
      { Id: 2, Name: 'Jane Doe', Role: 'Other' },
    ];
    const petParents = [{ PetParentID: 1, PetParentName: 'John Doe' }];
    authService.isLoggedIn//.and.returnValue(true);
    authService.getRoleFromToken//.and.returnValue('Doctor'); // or 'Receptionist'
    authService.getAllUsers//.and.returnValue(of(users));

    fixture.detectChanges();

    expect(authService.getAllUsers).toHaveBeenCalled();
    // expect(component.petParents).toEqual(petParents);
    // expect(component.filteredPetParents).toEqual(petParents);
  });

  // Test for selecting a general pet issue
  it('should select a general pet issue and add it to appointment details', () => {
    const petIssueName = 'Skin irritation';
    component.selectPetIssue(petIssueName);

    expect(component.appointmentDetail.PetIssues.length).toBe(1);
    expect(component.appointmentDetail.PetIssues[0].IssueName).toEqual(petIssueName);
  });

  // Test for deselecting a pet issue
  it('should deselect a pet issue from appointment details', () => {
    const petIssue: PetIssue = { PetIssueID: 1, IssueName: 'Skin irritation' };
    component.appointmentDetail.PetIssues.push(petIssue);
    component.onDisSelectPetIssue(petIssue);

    expect(component.appointmentDetail.PetIssues.length).toBe(0);
  });

})
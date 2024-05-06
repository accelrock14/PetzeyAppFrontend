import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, RouterLink, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { PetProfileComponent } from './pet-profile.component';
import { IPet } from '../../../models/Pets/IPet';
import { User } from '../../../models/User-Authentication/User';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgePipe } from '../../../pipes/Age/age.pipe';
import { FormatDatePipe } from '../../../pipes/Date/format-date.pipe';
import { DatePipe, NgIf } from '@angular/common';
import { ReportHistoryComponent } from '../../appointments/report-history/report-history.component';
import { PetAppointmentsListComponent } from '../pet-appointments-list/pet-appointments-list.component';

describe('PetProfileComponent', () => {
  let component: PetProfileComponent;
  let fixture: ComponentFixture<PetProfileComponent>;
  let petsServiceSpy: jasmine.SpyObj<PetsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const petsServiceSpyObj = jasmine.createSpyObj('PetsService', ['GetPetDetailsByID']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [PetProfileComponent, HttpClientTestingModule,AgePipe,
        FormatDatePipe,
        DatePipe,
        NgIf,
        RouterLink,
        ReportHistoryComponent,
        PetAppointmentsListComponent,ActivatedRoute],
      providers: [
        { provide: PetsService, useValue: petsServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PetProfileComponent);
    component = fixture.componentInstance;
    petsServiceSpy = TestBed.inject(PetsService) as jasmine.SpyObj<PetsService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });
 
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  // it('should fetch pet details on initialization', fakeAsync(() => {
  //   const dummyPet: IPet = {
      
  //       PetID: 1, PetName: 'Fluffy',
  //       PetParentID: '1',
  //       PetImage: '',
  //       Species: 'Dog',
  //       Breed: 'dog',
  //       BloodGroup: 'd',
  //       Gender: 'male',
  //       Neutered: false,
  //       DateOfBirth: new Date(),
  //       Allergies: '',
  //       LastAppointmentDate: new Date()
      
  //   };
  //   petsServiceSpy.GetPetDetailsByID.and.returnValue(of(dummyPet));

  //   component.ngOnInit();
  //   tick();

  //   expect(petsServiceSpy.GetPetDetailsByID).toHaveBeenCalled();
  //   expect(component.Pet).toEqual(dummyPet);
  // }));
  // it('should fetch pet owner details if user is logged in', fakeAsync(() => {
  //   const dummyPet: IPet = {
  //     PetID: 1, PetName: 'Fluffy',
  //       PetParentID: '1',
  //       PetImage: '',
  //       Species: 'Dog',
  //       Breed: 'dog',
  //       BloodGroup: 'd',
  //       Gender: 'male',
  //       Neutered: false,
  //       DateOfBirth: new Date(),
  //       Allergies: '',
  //       LastAppointmentDate: new Date()
  //   };
  //   const dummyUser: User = {
  //     Id: '1',
  //     Name: 'Dummy Owner',
  //     City: '',
  //     State: '',
  //     Country: '',
  //     Email: '',
  //     Phone: '',
  //     Role: 'Oncologist',
  //     Npi: '1234',
  //     Speciality: ''
  //   };
  //   authServiceSpy.isLoggedIn.and.returnValue(true);
  //   authServiceSpy.getAllUsers.and.returnValue(of([dummyUser]));

  //   component.Pet = dummyPet;
  //   component.ngOnInit();
  //   tick();

  //   expect(authServiceSpy.getAllUsers).toHaveBeenCalled();
  //   expect(component.petOwner).toEqual(dummyUser);
  // }));
});



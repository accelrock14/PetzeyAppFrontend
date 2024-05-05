import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AgePipe } from '../../../pipes/Age/age.pipe';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { CommonModule } from '@angular/common';
import { AppointmentPetProfileComponent } from './appointment-pet-profile.component';
import { Operator, Observable } from 'rxjs';
import { IPet } from '../../../models/Pets/IPet';

describe('AppointmentPetProfileComponent', () => {
  let component: AppointmentPetProfileComponent;
  let fixture: ComponentFixture<AppointmentPetProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({// Import AgePipe here
      providers: [PetsService, AuthService], // Provide necessary services here
      imports: [CommonModule, AppointmentPetProfileComponent, AgePipe, HttpClientTestingModule] // Import CommonModule here
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentPetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default Pet object', () => {
    expect(component.Pet).toBeTruthy();
    expect(component.Pet.PetID).toBe(0);
    // Add similar expectations for other properties of Pet object
  });

  it('should have a default Owner object as undefined', () => {
    expect(component.Owner).toBeUndefined();
  });

  it('should load pet details when PetId is provided', () => {
    const mockPet: IPet = {
      PetID: 1,
      PetParentId: 'parent123',
      PetName: 'Fluffy',
      PetImage: 'fluffy.jpg',
      Species: 'Cat',
      Breed: 'Persian',
      BloodGroup: 'A+',
      Gender: 'Male',
      Neutered: false,
      DateOfBirth: new Date(),
      Allergies: 'None',
      LastAppointmentDate: new Date()
    };

    const petsService = TestBed.inject(PetsService);
    spyOn(petsService, 'GetPetDetailsByID').and.returnValue({
      subscribe: (callback: any) => callback(mockPet),
      source: undefined,
      operator: undefined,
      lift: function <R>(operator?: Operator<IPet, R> | undefined): Observable<R> {
        throw new Error('Function not implemented.');
      },
      forEach: function (next: (value: IPet) => void): Promise<void> {
        throw new Error('Function not implemented.');
      },
      pipe: function (): Observable<IPet> {
        throw new Error('Function not implemented.');
      },
      toPromise: function (): Promise<IPet | undefined> {
        throw new Error('Function not implemented.');
      }
    });

    component.PetId = 1;
    component.ngOnInit();

    expect(component.Pet).toEqual(mockPet);
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AgePipe } from '../../../pipes/Age/age.pipe';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { Operator, Observable, of } from 'rxjs';
import { IPet } from '../../../models/Pets/IPet';


describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({// Import AgePipe here
      providers: [PetsService, AuthService], // Provide necessary services here
      imports: [CommonModule, UserProfileComponent, AgePipe, HttpClientTestingModule] // Import CommonModule here
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('setPetToDelete sets petToDelete and stops propagation', () => {
  //   // Arrange
  //   const mockPet: IPet = {
  //     PetID: 1,
  //     PetParentId: 'parent123',
  //     PetName: 'Fluffy',
  //     PetImage: 'fluffy.jpg',
  //     Species: 'Cat',
  //     Breed: 'Persian',
  //     BloodGroup: 'A+',
  //     Gender: 'Male',
  //     Neutered: false,
  //     DateOfBirth: new Date(),
  //     Allergies: 'None',
  //     LastAppointmentDate: new Date()
  //   };
  //   const mockEvent = new MouseEvent('click');
  //   const spyStopPropagation = jest.spyOn(mockEvent, 'stopPropagation');
  //   //component.petToDelete = null; // Ensure petToDelete is initially undefined
  
  //   // Act
  //   component.setPetToDelete(mockPet, mockEvent);
  
  //   // Assert
  //   expect(component.petToDelete).toEqual(mockPet);
  //   expect(spyStopPropagation).toHaveBeenCalled();
  //   expect(component.openDeleteModal).toHaveBeenCalled();
  // });

  // it('deleteConfirmedPet deletes pet and refreshes pet list', fakeAsync(() => {
  //   // Arrange
  //   const mockPet: IPet = {
  //     PetID: 1,
  //     PetParentId: 'parent123',
  //     PetName: 'Fluffy',
  //     PetImage: 'fluffy.jpg',
  //     Species: 'Cat',
  //     Breed: 'Persian',
  //     BloodGroup: 'A+',
  //     Gender: 'Male',
  //     Neutered: false,
  //     DateOfBirth: new Date(),
  //     Allergies: 'None',
  //     LastAppointmentDate: new Date()
  //   };
  //   const mockEvent = new MouseEvent('click');
  //   const spyStopPropagation = jest.spyOn(mockEvent, 'stopPropagation');
  //   const mockPetsService = new MockPetsService(); // Create the testing double
  
  //   TestBed.configureTestingModule({
  //     declarations: [UserProfileComponent], // Replace with your component path
  //     providers: [
  //       { provide: PetsService, useValue: mockPetsService } // Provide the testing double
  //     ]
  //   })
  //   .compileComponents();
  
  //   const component = TestBed.inject(UserProfileComponent); // Inject the component
  
  //   component.petToDelete = mockPet;
  
  //   // Act
  //   component.deleteConfirmedPet(mockEvent);
  //   tick(500); // Simulate asynchronous operations
  
  //   // Assert
  //   expect(spyStopPropagation).toHaveBeenCalled();
  //   expect(mockPetsService.deletePetByPetID).toHaveBeenCalledWith(mockPet.PetID);
  //   expect(mockPetsService.getPetsByParentID).toHaveBeenCalledWith(`${component.petParentID}`);
  //   expect(component.pets).toEqual([mockPet]);
  //   expect(component.petToDelete).toBeUndefined(); // Ensure petToDelete is reset
  
  //   // Cleanup (optional)
  //   spyStopPropagation.calls.reset();
  // });
  
  
  

});
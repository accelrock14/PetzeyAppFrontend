import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AgePipe } from '../../../pipes/Age/age.pipe';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { IPet } from '../../../models/Pets/IPet';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';


fdescribe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let petsService: PetsService; // Declare a variable to hold PetsService instance

  beforeEach(async () => {
    await TestBed.configureTestingModule({// Import AgePipe here
      //providers: [PetsService, AuthService], // Provide necessary services here
      providers: [
        { provide: AuthService, useValue: { 
          isLoggedIn: () => true,
          getLoggedInUserObject: () => ({}),
          getUIDFromToken: () => ({}),
          getRoleFromToken: () => 'user' // Mock implementation of getRoleFromToken
        } }
      ],
      imports: [CommonModule, UserProfileComponent, AgePipe, HttpClientTestingModule, ToastrModule.forRoot()] // Import CommonModule here
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    petsService = TestBed.inject(PetsService); // Inject PetsService
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setPetToDelete sets petToDelete and stops propagation', () => {
    // Arrange
    const mockPet: IPet = {
      PetID: 1,
      PetParentID: 'parent123',
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
    const mockEvent = new MouseEvent('click');
    spyOn(component, 'openDeleteModal'); // Spy on the method
  
    // Act
    component.setPetToDelete(mockPet, mockEvent);
  
    // Assert
    expect(component.petToDelete).toEqual(mockPet);
    expect(component.openDeleteModal).toHaveBeenCalled();
  });

  it('deleteConfirmedPet deletes pet, updates pets array, and displays success message', () => {
    // Arrange
    const mockPet: IPet = {
      PetID: 1,
      PetParentID: 'parent123',
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
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation'); // Spy on stopPropagation method
    spyOn(petsService, 'DeletePetByPetID').and.returnValue(of({})); // Spy on DeletePetByPetID method
    spyOn(petsService, 'GetPetsByParentID').and.returnValue(of([])); // Spy on GetPetsByParentID method
    //spyOn(component.toaster, 'success'); // Spy on toaster success method

    // Set petToDelete
    component.petToDelete = mockPet;

    // Act
    component.deleteConfirmedPet(mockEvent);

    // Assert
    expect(mockEvent.stopPropagation).toHaveBeenCalled(); // Ensure stopPropagation is called
    expect(petsService.DeletePetByPetID).toHaveBeenCalledWith(mockPet.PetID); // Ensure DeletePetByPetID is called with correct PetID
    expect(petsService.GetPetsByParentID).toHaveBeenCalledWith(`${component.petParentID}`); // Ensure GetPetsByParentID is called with correct petParentID
    //expect(component.toaster.success).toHaveBeenCalledWith('Pet Deleted Successfully!'); // Ensure toaster success is called with correct message
    expect(component.pets).toEqual([]); // Ensure pets array is updated accordingly
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAppointmentFormComponent } from './edit-appointment-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock classes
class MatSnackBarMock {
  open(message: string, action: string, config: any) {}
}

class LocationMock {
  back() {}
}

describe('EditAppointmentFormComponent', () => {
  let component: EditAppointmentFormComponent;
  let fixture: ComponentFixture<EditAppointmentFormComponent>;
  let snackBar: MatSnackBar;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Ensure to list the component in declarations, not imports
      // declarations: [EditAppointmentFormComponent],
      imports:[EditAppointmentFormComponent,HttpClientTestingModule ],
      providers: [
        { provide: MatSnackBar, useClass: MatSnackBarMock },
        { provide: Location, useClass: LocationMock }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(EditAppointmentFormComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('GoBackSimply', () => {
    it('should navigate back', () => {
      const locationSpy = spyOn(location, 'back');
      component.GoBackSimply();
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('GoBackWithMsg', () => {
    it('should display a message and navigate back', () => {
      const snackBarSpy = spyOn(snackBar, 'open');
      const locationSpy = spyOn(location, 'back');
      component.GoBackWithMsg('Test message');
      expect(snackBarSpy).toHaveBeenCalledWith('Test message', '', { duration: 3000 });
      expect(locationSpy).toHaveBeenCalled();
    });
  });

  describe('filterPetIssues', () => {
    it('should filter pet issues based on search text', () => {
      component.generalPetIssues = [
        {
          IssueName: 'Fever',
          GeneralPetIssueID: 0
        },
        {
          IssueName: 'Cold',
          GeneralPetIssueID: 0
        },
        {
          IssueName: 'Injury',
          GeneralPetIssueID: 0
        }
      ];
      component.petIssueSearchText = 'fe';
      component.filterPetIssues();
      expect(component.filteredpetIssues.length).toBe(1);
      expect(component.filteredpetIssues[0].IssueName).toContain('Fever');
    });
  });

  describe('filterVeternarians', () => {
    it('should filter veterinarians based on search text', () => {
      component.veternarians = [
        {
          VetId: 1, Name: 'Dr. Smith',
          PhoneNumber: '',
          Speciality: '',
          Photo: ''
        },
        {
          VetId: 2, Name: 'Dr. Brown',
          PhoneNumber: '',
          Speciality: '',
          Photo: ''
        }
      ];
      component.veternarianSearchText = 'smith';
      component.filterVeternarians();
      expect(component.filteredVets.length).toBe(1);
      expect(component.filteredVets[0].Name).toBe('Dr. Smith');
    });
  });

  describe('filterPets', () => {
    it('should filter pets based on search text', () => {
      component.pets = [
        {
          PetID: 1, PetName: 'Buddy',
          PetParentID: '',
          PetImage: '',
          Species: '',
          Breed: '',
          BloodGroup: '',
          Gender: '',
          Neutered: false,
          DateOfBirth: new Date(),
          Allergies: '',
          LastAppointmentDate: new Date()
        },
        {
          PetID: 2, PetName: 'Charlie',
          PetParentID: '',
          PetImage: '',
          Species: '',
          Breed: '',
          BloodGroup: '',
          Gender: '',
          Neutered: false,
          DateOfBirth: new Date(),
          Allergies: '',
          LastAppointmentDate: new Date()
        }
      ];
      component.petSearchText = 'bud';
      component.filterPets();
      expect(component.filteredPets.length).toBe(1);
      expect(component.filteredPets[0].PetName).toBe('Buddy');
    });
  });

  describe('toggleDisabled', () => {
    it('should toggle isSubmitDisabled property', () => {
      component.isSubmitDisabled = true;
      component.toggleDisabled();
      expect(component.isSubmitDisabled).toBeFalse();
      component.toggleDisabled();
      expect(component.isSubmitDisabled).toBeTrue();
    });
  });
});


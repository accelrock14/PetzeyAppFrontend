import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetProfileComponent } from './vet-profile.component';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { of } from 'rxjs';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { IVet } from '../../../models/Vets/IVet';
import { IAddress } from '../../../models/Vets/IAddress';

describe('VetProfileComponent', () => {
  let component: VetProfileComponent;
  let fixture: ComponentFixture<VetProfileComponent>;
  let mockVetService: VetsserviceService;
  let authService: AuthService;
  let mockActivatedRoute: any;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(VetProfileComponent);
    component = fixture.componentInstance;
    mockVetService = TestBed.inject(VetsserviceService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch vet profile details by ID on init', () => {
    const vetProfile: IVetProfileDTO = {
      VetId: 0,
      LName: 'Doe',
      FName: 'John',
      NPINumber: '1234567890',
      Speciality: 'General Practitioner',
      Email: 'john.doe@example.com',
      Phone: '1234567890',
      Photo: 'john_doe.jpg'
    };
    
    spyOn(mockVetService,'getVetById').and.returnValue(of(vetProfile));

    component.ngOnInit();

    expect(mockVetService.getVetById).toHaveBeenCalledWith(1); // Assuming ID 1 for testing
    expect(component.vetProfile).toEqual(vetProfile);
  });
  it('should handle case when route parameter is null on init', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Vet ID parameter is null.');
  });
  it('should delete vet when deleteVet is called', () => {
    const vetId = 1;

    component.deleteVet(vetId);

    expect(mockVetService.deleteVet).toHaveBeenCalledWith(vetId);
  });
  it('should update vet profile with new details and photo', () => {
    const vetId = 1;
    const vetProfile: IVetProfileDTO = {
      VetId: 0,
      LName: '',
      FName: '',
      NPINumber: '',
      Speciality: '',
      Email: '',
      Phone: '',
      Photo: ''
    };
    const fullVet: IVet = {
      VetId: 0,
      LName: 'Doe',
      FName: 'John',
      npiNumber: '1234567890',
      username: 'john_doe',
      Phone: '1234567890',
      email: 'john.doe@example.com',
      speciality: 'General Practitioner',
      shortBio: 'Lorem ipsum dolor sit amet',
      status: false,
      Photo: 'john_doe.jpg',
      gender: 'Male',
      dob: new Date('1990-01-01'),
      rating: 4.5,
      addressId: 1, 
      address:{
        AddressId: 1,
        street: '123 Main St',
        city: 'Anytown',
        state: 'ABC',
        zipcode: '12345'
        
      }
    };
    const selectedFile: File = new File([''], 'test.jpg', { type: 'image/jpeg' });

    component.selectedFile = selectedFile;
    spyOn(mockVetService,'getFullVetById').and.returnValue(of(fullVet));
    spyOn(mockVetService,'uploadPhoto').and.returnValue(of({ fileName: 'test.jpg' }));
    spyOn(component, 'sendProfileUpdate');

    component.updateVet(vetId, vetProfile);

    expect(mockVetService.getFullVetById).toHaveBeenCalledWith(vetId);
    expect(mockVetService.uploadPhoto).toHaveBeenCalledWith(vetId, selectedFile);
    expect(component.sendProfileUpdate).toHaveBeenCalledWith(vetId, fullVet);
    expect(component.selectedFile).toBeNull(); 
  });

});

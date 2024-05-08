import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AddVetComponent } from './add-vet.component';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVet } from '../../../models/Vets/IVet';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('AddVetComponent', () => {
  let component: AddVetComponent;
  let fixture: ComponentFixture<AddVetComponent>;
  let vetService: VetsserviceService;
  let toastr: ToastrService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVetComponent);
    
    vetService = TestBed.inject(VetsserviceService);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });
  const mockVet: IVet = {
    VetId: 1,
    LName: '',
    FName: '',
    npiNumber: '',
    username: '',
    Phone: '',
    email: '',
    speciality: '',
    shortBio: '',
    status: false,
    Photo: '',
    gender: '',
    dob: new Date(),
    rating: 0,
    addressId: 0,
    address: {
      AddressId: 0,
      city: '',
      street: '',
      zipcode: '',
      state: ''
    }
  };
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component and initialize the vet object', () => {
    expect(component).toBeTruthy();
    expect(component.vet).toBeTruthy();
    expect(component.vet.VetId).toBe(0);
  });

  
  it('should call addVet method and handle response correctly', () => {
    spyOn(vetService, 'addVet').and.returnValue(of(mockVet)); 
  
    component.addVet(component.vet);
    expect(vetService.addVet).toHaveBeenCalled();
    expect(component.vet).toEqual(jasmine.objectContaining({ VetId: 1 })); 
  });

  it('should display a success notification when vet is added', () => {
    spyOn(vetService, 'addVet').and.returnValue(of(mockVet));
    let toastrSpy = spyOn(toastr, 'success');
    
    component.addVet(component.vet);
    expect(toastrSpy).toHaveBeenCalledWith('Vet added successfully');
  });
  
  it('should navigate to the vet list page after successful addition', () => {
    spyOn(vetService, 'addVet').and.returnValue(of(mockVet));
    let navigateSpy = spyOn(router, 'navigate');
    
    component.addVet(component.vet);
    expect(navigateSpy).toHaveBeenCalledWith(['/vet']);
  });
  
  
  
});


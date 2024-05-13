import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetProfileApptComponent } from './vet-profile-appt.component';
import { IVetProfileDTO } from '../../../models/Vets/IVetProfileDto';
import { of } from 'rxjs';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';

describe('VetProfileApptComponent', () => {
  let component: VetProfileApptComponent;
  let fixture: ComponentFixture<VetProfileApptComponent>;
  let mockVetService: VetsserviceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetProfileApptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VetProfileApptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getVetById method with correct ID on initialization', () => {
    const vetId = '1';
    component.VetId = vetId;
    const vetProfile: IVetProfileDTO = {
      VetId: 1,
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

    expect(mockVetService.getVetById).toHaveBeenCalledWith(parseInt(vetId));
    expect(component.vetProfile).toEqual(vetProfile);
  });
});

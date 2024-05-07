import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsListGridComponent } from './pets-list-grid.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { PetCardComponent } from "../pet-card/pet-card.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { AppointmentDetailsService } from '../../../services/appointment-details.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PetsService } from '../../../services/PetsServices/pets.service';

describe('PetsListGridComponent', () => {
  let component: PetsListGridComponent;
  let fixture: ComponentFixture<PetsListGridComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const petsServiceMock = jasmine.createSpyObj('PetsService', ['GetPetsCount']);
  let appointmentDetailsServiceMock: jasmine.SpyObj<AppointmentDetailsService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRoleFromToken', 'getAllUserIDsandNames']);
    const appointmentDetailsServiceSpy = jasmine.createSpyObj('AppointmentDetailsService', ['GetAllPetIDByVetId']);

    await TestBed.configureTestingModule({

      imports: [FormsModule, CommonModule,PetsListGridComponent, AgePipe, PetCardComponent,HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ page: 1 }) } },
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AppointmentDetailsService, useValue: appointmentDetailsServiceSpy },
        { provide: PetsService, useValue: petsServiceMock }
      ]
    }).compileComponents();

    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    appointmentDetailsServiceMock = TestBed.inject(AppointmentDetailsService) as jasmine.SpyObj<AppointmentDetailsService>;
   // const getPetsCountSpy = petsServiceMock.GetPetsCount.and.returnValue(of(totalCount));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetsListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.pets).toEqual([]);
    expect(component.recentlyConsultedPets).toEqual([]);
    expect(component.petsFilter).toEqual({ PetName: '', Species: '', PetIDs: [] });
    expect(component.speciesOptions).toEqual(['Dog', 'Cat', 'Reptile', 'Other']);
    expect(component.errorMessage).toEqual('');
    expect(component.currentPage).toEqual(1);
    expect(component.itemsPerPage).toEqual(8);
    expect(component.totalPages).toEqual(0);
    expect(component.pages).toEqual([]);
  });

  it('should calculate total pages based on total count of pets and items per page', () => {
    const totalCount = 20; // Total count of pets
    const itemsPerPage = 8; // Items per page
    const expectedTotalPages = Math.ceil(totalCount / itemsPerPage);
    const getPetsCountSpy = petsServiceMock.GetPetsCount.and.returnValue(of(totalCount));

    component.itemsPerPage = itemsPerPage;

    component.calculateTotalPages();
    expect(component.totalPages).toEqual(expectedTotalPages);

    expect(getPetsCountSpy).toHaveBeenCalled();
  });

});

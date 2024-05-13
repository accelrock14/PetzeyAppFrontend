import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VetComponent } from './vet.component';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

describe('VetComponent', () => {
  let component: VetComponent;
  let fixture: ComponentFixture<VetComponent>;
  let vetService: VetsserviceService;
  let authService: AuthService;

  const mockVets: IVetCardDTO[] = [
    { VetId: 1, Name: 'Dr. Smith', Speciality: 'Cardiology', PhoneNumber: '1234567890', Photo: 'photo1.jpg' },
    { VetId: 2, Name: 'Dr. Johnson', Speciality: 'Dermatology', PhoneNumber: '0987654321', Photo: 'photo2.jpg' },
  ];

  const mockSpecialties = ['Cardiology', 'Dermatology', 'Neurology'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VetComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: VetsserviceService, useValue: { getAllVets: () => of(mockVets), getTopRatedVets: () => of(mockVets), getUniqueSpecialties: () => of(mockSpecialties), getVetsBySpecialty: () => of(mockVets) } },
        { provide: AuthService, useValue: { isLoggedIn: () => true, getRoleFromToken: () => 'Receptionist' } }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VetComponent);
    component = fixture.componentInstance;
    vetService = TestBed.inject(VetsserviceService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all vets on initialization', () => {
    spyOn(vetService, 'getAllVets').and.returnValue(of(mockVets));
    component.ngOnInit();
    expect(vetService.getAllVets).toHaveBeenCalled();
    expect(component.vets.length).toBe(2);
  });

  it('should fetch top-rated vets on initialization', () => {
    spyOn(vetService, 'getTopRatedVets').and.returnValue(of(mockVets));
    component.ngOnInit();
    expect(vetService.getTopRatedVets).toHaveBeenCalled();
    expect(component.topRatedVets.length).toBe(2);
  });

  it('should fetch unique specialties on initialization', () => {
    spyOn(vetService, 'getUniqueSpecialties').and.returnValue(of(mockSpecialties));
    component.ngOnInit();
    expect(vetService.getUniqueSpecialties).toHaveBeenCalled();
    expect(component.specialties.length).toBe(3);
  });

  it('should filter vets based on search query', () => {
    component.searchQuery = 'Smith';
    component.vets = mockVets;
    component.filterVets();
    expect(component.filteredVets.length).toBe(1);
    expect(component.filteredVets[0].Name).toBe('Dr. Smith');
  });

  it('should navigate to add vet page', () => {
    const navigateSpy = spyOn((fixture.debugElement.injector.get(RouterTestingModule) as any)._router, 'navigate');
    component.navigateToAddVet();
    expect(navigateSpy).toHaveBeenCalledWith(['/add-vet']);
  });

  it('should open vet profile on click', () => {
    const navigateSpy = spyOn((fixture.debugElement.injector.get(RouterTestingModule) as any)._router, 'navigate');
    component.openVetProfile(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/vet-profile', 1]);
  });

  it('should filter vets by specialty', () => {
    spyOn(vetService, 'getVetsBySpecialty').and.returnValue(of([mockVets[0]]));
    component.selectedSpecialties = ['Cardiology'];
    component.filteringVets();
    expect(component.fVets.length).toBe(1);
    expect(component.fVets[0].Speciality).toBe('Cardiology');
  });

  it('should select all vets when selectall is called', () => {
    spyOn(vetService, 'getAllVets').and.returnValue(of(mockVets));
    component.selectall();
    expect(component.fVets.length).toBe(2);
  });

  it('should update filtered vets correctly', () => {
    component.vets = mockVets;
    component.searchQuery = '';
    component.currentPage = 1;
    component.pageSize = 1;
    component.updateFilteredVets();
    expect(component.filteredVets.length).toBe(1);
  });

  it('should change pages correctly', () => {
    component.vets = mockVets;
    component.searchQuery = '';
    component.pageSize = 1;
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.filteredVets.length).toBe(1);
    expect(component.filteredVets[0].Name).toBe('Dr. Johnson');
  });

  it('should have pagination array based on total pages', () => {
    component.totalPages = 3;
    const pages = component.totalPagesArray;
    expect(pages.length).toBe(3);
    expect(pages).toEqual([1, 2, 3]);
  });
});

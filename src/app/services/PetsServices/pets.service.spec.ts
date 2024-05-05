import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetsService } from './pets.service';
import { IPet } from '../../models/Pets/IPet';
import { IPetFilterParams } from '../../models/Pets/IPetFilterParams';

describe('PetsService', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetsService]
    });
    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all pets', () => {
    const mockPets: IPet[] = [
      {
        PetID: 1, PetName: 'Fluffy',
        PetParentID: '1',
        PetImage: '',
        Species: 'Dog',
        Breed: 'dog',
        BloodGroup: 'd',
        Gender: 'male',
        Neutered: false,
        DateOfBirth: new Date(),
        Allergies: '',
        LastAppointmentDate: new Date()
      }, 
      {
        PetID: 2, PetName: 'Spot',
        PetParentID: '1',
        PetImage: '',
        Species: 'Cat',
        Breed: 'cat',
        BloodGroup: 'c',
        Gender: 'female',
        Neutered: false,
        DateOfBirth: new Date(),
        Allergies: '',
        LastAppointmentDate: new Date()
      }
    ];

    service.GetAllPets().subscribe(pets => {
      expect(pets.length).toBe(2);
      expect(pets).toEqual(mockPets);
    });

    const request = httpMock.expectOne('https://petzeypetswebapi20240503003857.azurewebsites.net/api/pets');
    expect(request.request.method).toBe('GET');
    request.flush(mockPets);
  });

  it('should filter pets per page', () => {
    const mockPets: IPet[] = [
      {
        PetID: 1, PetName: 'Fluffy',
        PetParentID: '1',
        PetImage: '',
        Species: 'Dog',
        Breed: 'dog',
        BloodGroup: 'd',
        Gender: 'male',
        Neutered: false,
        DateOfBirth: new Date(),
        Allergies: '',
        LastAppointmentDate: new Date()
      }
    ];
    const filterParams: IPetFilterParams = { PetName: '', Species: 'Dog', PetIDs: [] };
    const pageNumber = 1;
    const pageSize = 10;

    service.FilterPetsPerPage(filterParams, pageNumber, pageSize).subscribe(pets => {
      expect(pets.length).toBe(1);
      expect(pets).toEqual(mockPets);
    });

    const apiUrl = 'https://petzeypetswebapi20240503003857.azurewebsites.net/api/pets/filters?pageNumber=1&pageSize=10';
    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(filterParams);
    request.flush(mockPets);
  });

  it('should handle error during filtering pets per page', () => {
    const filterParams: IPetFilterParams = { PetName: '', Species: 'Dog', PetIDs: [] };
    const pageNumber = 1;
    const pageSize = 10;
    const errorMessage = 'Internal Server Error';

    service.FilterPetsPerPage(filterParams, pageNumber, pageSize).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.statusText).toEqual(errorMessage);
      }
    });

    const apiUrl = 'https://petzeypetswebapi20240503003857.azurewebsites.net/api/pets/filters?pageNumber=1&pageSize=10';
    const request = httpMock.expectOne(apiUrl);
    request.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

});

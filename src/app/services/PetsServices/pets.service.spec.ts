import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetsService } from './pets.service';
import { IPet } from '../../models/Pets/IPet';
import { IPetFilterParams } from '../../models/Pets/IPetFilterParams';
import { petsServiceUrl } from '../../Shared/apiUrls';

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


  it('should return all pets', () => {
    const dummyPets: IPet[] = [
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
      expect(pets.length).toBe(dummyPets.length);
      expect(pets).toEqual(dummyPets);
    });

    const req = httpMock.expectOne(`${petsServiceUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPets);
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

    const apiUrl = `${petsServiceUrl}/filters?pageNumber=1&pageSize=10`;
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

    const apiUrl = `${petsServiceUrl}/filters?pageNumber=1&pageSize=10`;
    const request = httpMock.expectOne(apiUrl);
    request.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should filter pets', () => {
    const dummyPetFilters: IPetFilterParams = {
      PetName: '', PetIDs : [1,2], Species :"Dog"
    };
    const dummyFilteredPets: IPet[] = [
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
        PetID: 2, PetName: 'Fluffy',
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
    ];

    service.FilterPets(dummyPetFilters).subscribe(filteredPets => {
      expect(filteredPets.length).toBe(dummyFilteredPets.length);
      expect(filteredPets).toEqual(dummyFilteredPets);
    });

    const req = httpMock.expectOne(`${petsServiceUrl}/filter`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyPetFilters);
    req.flush(dummyFilteredPets);
  });

  it('should handle bad request during filtering pets', () => {
    const dummyPetFilters: IPetFilterParams = {
      PetName:'', PetIDs : [], Species:''
    };

    service.FilterPets(dummyPetFilters).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const req = httpMock.expectOne(`${petsServiceUrl}/filter`);
    expect(req.request.method).toBe('POST');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('should get pet details by ID', () => {
    const petID = 1; // Assuming pet ID 1 for testing
    const dummyPet: IPet = {
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
    };

    service.GetPetDetailsByID(petID).subscribe(pet => {
      expect(pet).toEqual(dummyPet);
    });

    const req = httpMock.expectOne(`${petsServiceUrl}/details/${petID}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPet);
  });

  it('should handle bad request during getting pets by ID', () => {
    const petID = 1; // Assuming pet ID 1 for testing

    service.GetPetDetailsByID(petID).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const req = httpMock.expectOne(`${petsServiceUrl}/details/${petID}`);
    expect(req.request.method).toBe('GET');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });
  it('should add a new pet successfully', () => {
    const dummyPet: IPet = {

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
    };

    service.AddPet(dummyPet).subscribe(pet => {
      expect(pet).toEqual(dummyPet);
    });

    const req = httpMock.expectOne(`${petsServiceUrl}/addnewpet`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyPet);
  });

  it('should handle bad request during add new pet', () => {
    const dummyPet: IPet = {
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
    };

    service.AddPet(dummyPet).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const req = httpMock.expectOne(`${petsServiceUrl}/addnewpet`);
    expect(req.request.method).toBe('POST');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('should edit a pet successfully', () => {
    const dummyPet: IPet = {
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
    };

    service.EditPet(dummyPet).subscribe(pet => {
      expect(pet).toEqual(dummyPet);
    });

    const req = httpMock.expectOne(`${petsServiceUrl}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyPet);
  });

  it('should handle bad request during editing pet', () => {
    const dummyPet: IPet = {
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
    };

    service.EditPet(dummyPet).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const req = httpMock.expectOne(`${petsServiceUrl}`);
    expect(req.request.method).toBe('PUT');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('should get pets by parent ID', () => {
    const petParentID = 'abcsodin-adsjnonacw-aksjjnca'; // Assuming parent ID for testing
    const dummyPets: IPet[] = [
      {
        PetID: 1, PetName: 'Fluffy',
        PetParentID: 'abcsodin-adsjnonacw-aksjjnca',
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
        PetID: 2, PetName: 'Fluffy',
        PetParentID: 'abcsodin-adsjnonacw-aksjjnca',
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

    service.GetPetsByParentID(petParentID).subscribe(pets => {
      expect(pets).toEqual(dummyPets);
    });

    const req = httpMock.expectOne(`${petsServiceUrl}/parentid/${petParentID}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPets);
  });

  it('should handle bad request while getting pet by parent ID', () => {
    const petParentID = 'parent123'; // Assuming parent ID 'parent123' for testing

    service.GetPetsByParentID(petParentID).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const req = httpMock.expectOne(`${petsServiceUrl}/parentid/${petParentID}`);
    expect(req.request.method).toBe('GET');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('should delete a pet successfully', () => {
    const petID = 1; // Assuming pet ID 1 for testing

    service.DeletePetByPetID(petID).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${petsServiceUrl}/${petID}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle bad request while deleting pet by pet ID', () => {
    const petID = 1; // Assuming pet ID 1 for testing

    service.DeletePetByPetID(petID).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const req = httpMock.expectOne(`${petsServiceUrl}/${petID}`);
    expect(req.request.method).toBe('DELETE');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('should add last appointment date successfully', () => {
    const petID = 1; // Assuming pet ID 1 for testing
    const date = new Date('2024-05-05'); // Assuming a specific date for testing

    service.AddLastAppointmentDate(petID, date);

    const apiUrl = `${petsServiceUrl}/AddLastAppointmentDate/${petID}`;
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(date);
    req.flush({});
  });

  it('should get pets count successfully', () => {
    const dummyFilterParams: IPetFilterParams = {
      PetName: "", PetIDs:[], Species:""
    };
    const dummyCount = 10; // Example count returned from the server

    service.GetPetsCount(dummyFilterParams).subscribe(count => {
      expect(count).toEqual(dummyCount);
    });

    const apiUrl = `${petsServiceUrl}/filters/count`;
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(dummyCount);
  });

  it('should handle bad request for getting pets count', () => {
    const dummyFilterParams: IPetFilterParams = {
      PetName: "", PetIDs:[], Species:""
    };

    service.GetPetsCount(dummyFilterParams).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy(); // Check if an error is received
        expect(error.status).toBe(400); // Check if the status code is 400
      }
    );

    const apiUrl = `${petsServiceUrl}/filters/count`;
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    // Simulate a bad request response
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

});

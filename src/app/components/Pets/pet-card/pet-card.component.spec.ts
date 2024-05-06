
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetCardComponent } from './pet-card.component';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { EllipsisPipe } from "../../../pipes/Ellipsis/ellipsis.pipe";
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('PetCardComponent', () => {
  let component: PetCardComponent;
  let fixture: ComponentFixture<PetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
     // declarations: [PetCardComponent, AgePipe, EllipsisPipe],
      imports: [RouterTestingModule, CommonModule,PetCardComponent, AgePipe, EllipsisPipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetCardComponent);
    component = fixture.componentInstance;

    component.pet = {
      PetID: 1,
      PetParentID: 'parent123',
      PetName: 'Fluffy',
      PetImage: 'fluffy.jpg',
      Species: 'Cat',
      Breed: 'Persian',
      BloodGroup: 'A+',
      Gender: 'Male',
      Neutered: false,
      DateOfBirth: new Date('2019-05-06'),
      Allergies: 'None',
      LastAppointmentDate: new Date()
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should contain a link to pet profile', () => {
  //   const linkDebugElement = fixture.debugElement.query(By.css('.card'));
  //   const routerLink = linkDebugElement.nativeElement.getAttribute('routerLink');
  //   expect(routerLink).toEqual(`pets-profile/${component.pet.PetID}`);
  // });

  it('should render pet information', () => {
    component.pet = {
      PetID: 1,
      PetParentID: 'parent123',
      PetName: 'Fluffy',
      PetImage: 'fluffy.jpg',
      Species: 'Cat',
      Breed: 'Persian',
      BloodGroup: 'A+',
      Gender: 'Male',
      Neutered: false,
      DateOfBirth: new Date('2019-05-06'),
      Allergies: 'None',
      LastAppointmentDate: new Date()
    };
    component.petOwner = 'Test Owner';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.card-title').textContent).toContain('Fluffy');
  });

  it('should not display owner information when petOwner is not provided', () => {
    component.pet = {
      PetID: 2,
      PetName: 'Test Pet',
      PetParentID: "1",
      Gender: 'Male',
      DateOfBirth: new Date('2019-01-01'),
      PetImage: 'fluffy.jpg',
      Species: 'Cat',
      Breed: 'Persian',
      BloodGroup: 'A+',
      Neutered: false,
      Allergies: 'None',
      LastAppointmentDate: new Date()
    };
    component.petOwner = '';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.card-text').textContent).not.toContain('Owner:');
  });

});




// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { PetCardComponent } from './pet-card.component';
// import { AgePipe } from "../../../pipes/Age/age.pipe";
// import { EllipsisPipe } from "../../../pipes/Ellipsis/ellipsis.pipe";
// import { RouterTestingModule } from '@angular/router/testing';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../services/UserAuthServices/auth.service';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ActivatedRouteMock } from '../../user-authentiaction/activated-route.mock';

// fdescribe('PetCardComponent', () => {
//   let component: PetCardComponent;
//   let fixture: ComponentFixture<PetCardComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       providers:[ActivatedRoute],
//       imports: [CommonModule, PetCardComponent, AgePipe,CommonModule,RouterLink,EllipsisPipe,HttpClientTestingModule]
//     }).compileComponents();

//     fixture = TestBed.createComponent(PetCardComponent);
//     component = fixture.componentInstance;

//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should have a default Pet object', () => {
//     expect(component.pet).toBeTruthy();
//     expect(component.pet.PetID).toBe(0);
//     // Add similar expectations for other properties of Pet object
//   });

//   // it('should display pet information correctly', () => {
//   //   component.pet = {
//   //     PetID: '1',
//   //     PetImage: 'https://example.com/image.jpg',
//   //     PetName: 'Test Pet',
//   //     Gender: 'Male',
//   //     DateOfBirth: new Date('2019-01-01')
//   //   };
//   //   component.petOwner = 'Test Owner';
//   //   fixture.detectChanges();

//   //   const compiled = fixture.nativeElement;
//   //   expect(compiled.querySelector('.card-title').textContent).toContain('Test Pet');
//   //   expect(compiled.querySelector('.card-text').textContent).toContain('Male');
//   //   expect(compiled.querySelector('.card-text').textContent).toContain('2 years'); // Assuming the age pipe returns '2 years'
//   //   expect(compiled.querySelector('.card-text').textContent).toContain('Owner: Test Owner');
//   // });

//   // it('should display default image when pet image is not available', () => {
//   //   component.pet = {
//   //     PetID: '1',
//   //     PetName: 'Test Pet',
//   //     Gender: 'Male',
//   //     DateOfBirth: new Date('2019-01-01')
//   //   };
//   //   fixture.detectChanges();

//   //   const compiled = fixture.nativeElement;
//   //   expect(compiled.querySelector('img').src).toContain('https://placehold.co/100x100');
//   // });

//   // it('should not display owner information when petOwner is not provided', () => {
//   //   component.pet = {
//   //     PetID: '1',
//   //     PetImage: 'https://example.com/image.jpg',
//   //     PetName: 'Test Pet',
//   //     Gender: 'Male',
//   //     DateOfBirth: new Date('2019-01-01')
//   //   };
//   //   component.petOwner = '';
//   //   fixture.detectChanges();

//   //   const compiled = fixture.nativeElement;
//   //   expect(compiled.querySelector('.card-text').textContent).not.toContain('Owner:');
//   // });

//   // Add more test cases as needed
// });

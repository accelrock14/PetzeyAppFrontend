import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteMock } from '../activated-route.mock';
import { HttpClientModule } from '@angular/common/http';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninComponent,HttpClientModule],
      providers: [
        // Provide the mock ActivatedRoute
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain buttons for Pet Owner and Veterinary Doctor', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.btn-group')).toBeTruthy();
    expect(compiled.querySelectorAll('.btn').length).toBe(2);
    expect(compiled.querySelectorAll('.btn')[0].textContent).toContain('Pet Owner');
    expect(compiled.querySelectorAll('.btn')[1].textContent).toContain('Veterinary Doctor');
  });

  it('should have correct href for Pet Owner button', () => {
    const compiled = fixture.nativeElement;
    const petOwnerButton = compiled.querySelector('.btn-group .btn:first-child a');
    expect(petOwnerButton.getAttribute('href')).toContain('B2C_1_signup_signin');
  });

  it('should have correct href for Veterinary Doctor button', () => {
    const compiled = fixture.nativeElement;
    const vetDoctorButton = compiled.querySelector('.btn-group .btn:last-child a');
    expect(vetDoctorButton.getAttribute('href')).toContain('B2C_1_doctor_signin-signup');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FeedbackService } from '../../../services/feedback.service';
import { AuthService } from '../../../services/UserAuthServices/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EllipsisPipe } from '../../../pipes/Ellipsis/ellipsis.pipe';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { PetAppointmentCardComponent } from '../../appointment-cards/pet-appointment-card/pet-appointment-card.component';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';

describe('PetAppointmentCardComponent', () => {
  let component: PetAppointmentCardComponent;
  let fixture: ComponentFixture<PetAppointmentCardComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let feedbackServiceSpy: jasmine.SpyObj<FeedbackService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const feedbackServiceSpyObj = jasmine.createSpyObj('FeedbackService', ['someServiceMethod']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['someAuthServiceMethod']);
    const toastrServiceSpyObj = jasmine.createSpyObj('ToastrService', ['someToastrMethod']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, CommonModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        { provide: FeedbackService, useValue: feedbackServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: ToastrService, useValue: toastrServiceSpyObj },
        {
          provide: ActivatedRoute, // Provide ActivatedRoute
          useValue: {
            snapshot: {} // Mock snapshot data if needed
          }
        },
        DatePipe, RouterLink, RouterLinkActive, RouterOutlet
      ]
    }).compileComponents();

    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    feedbackServiceSpy = TestBed.inject(FeedbackService) as jasmine.SpyObj<FeedbackService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture = TestBed.createComponent(PetAppointmentCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snackbar with correct message', () => {
    // Mock data
    const arg0 = 'mock-service';

    // Call method
    component.openPopup(arg0);

    // Assertions
    expect(snackBarSpy.open).toHaveBeenCalledWith(`${arg0} service will be available soon`, 'Close', {
      verticalPosition: 'bottom'
    });
  });

});

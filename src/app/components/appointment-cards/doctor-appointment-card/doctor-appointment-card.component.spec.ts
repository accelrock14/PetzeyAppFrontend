import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../../../services/feedback.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

import { DoctorAppointmentCardComponent } from '../../appointment-cards/doctor-appointment-card/doctor-appointment-card.component';
import { AppointmentCardDto } from '../../../models/Appointment/AppointmentCardDto';

describe('DoctorAppointmentCardComponent', () => {
  let component: DoctorAppointmentCardComponent;
  let fixture: ComponentFixture<DoctorAppointmentCardComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let feedbackServiceSpy: jasmine.SpyObj<FeedbackService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const feedbackServiceSpyObj = jasmine.createSpyObj('FeedbackService', ['someServiceMethod']);
    const toastrServiceSpyObj = jasmine.createSpyObj('ToastrService', ['someToastrMethod']);

    await TestBed.configureTestingModule({
      declarations: [], // Remove DoctorAppointmentCardComponent from declarations
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        { provide: FeedbackService, useValue: feedbackServiceSpyObj },
        { provide: ToastrService, useValue: toastrServiceSpyObj },
        {
          provide: ActivatedRoute, // Provide ActivatedRoute
          useValue: {
            snapshot: {} // Mock snapshot data if needed
          }
        }
      ]
    }).compileComponents();

    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    feedbackServiceSpy = TestBed.inject(FeedbackService) as jasmine.SpyObj<FeedbackService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture = TestBed.createComponent(DoctorAppointmentCardComponent);
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

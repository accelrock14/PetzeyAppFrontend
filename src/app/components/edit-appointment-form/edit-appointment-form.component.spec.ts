import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmentFormComponent } from './edit-appointment-form.component';

describe('EditAppointmentFormComponent', () => {
  let component: EditAppointmentFormComponent;
  let fixture: ComponentFixture<EditAppointmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAppointmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

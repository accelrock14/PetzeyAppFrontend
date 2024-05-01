import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAppointmentCardComponent } from './pet-appointment-card.component';

describe('PetAppointmentCardComponent', () => {
  let component: PetAppointmentCardComponent;
  let fixture: ComponentFixture<PetAppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetAppointmentCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetAppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

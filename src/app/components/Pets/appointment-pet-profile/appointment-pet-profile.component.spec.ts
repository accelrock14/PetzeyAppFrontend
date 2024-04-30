import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPetProfileComponent } from './appointment-pet-profile.component';

describe('AppointmentPetProfileComponent', () => {
  let component: AppointmentPetProfileComponent;
  let fixture: ComponentFixture<AppointmentPetProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentPetProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentPetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

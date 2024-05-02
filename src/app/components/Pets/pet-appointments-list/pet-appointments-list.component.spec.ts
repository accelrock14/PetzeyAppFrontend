import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAppointmentsListComponent } from './pet-appointments-list.component';

describe('PetAppointmentsListComponent', () => {
  let component: PetAppointmentsListComponent;
  let fixture: ComponentFixture<PetAppointmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetAppointmentsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetAppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

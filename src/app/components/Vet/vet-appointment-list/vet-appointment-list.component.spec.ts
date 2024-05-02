import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetAppointmentListComponent } from './vet-appointment-list.component';

describe('VetAppointmentListComponent', () => {
  let component: VetAppointmentListComponent;
  let fixture: ComponentFixture<VetAppointmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetAppointmentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VetAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

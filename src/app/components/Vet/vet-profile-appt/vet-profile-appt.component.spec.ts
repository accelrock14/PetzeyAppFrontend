import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetProfileApptComponent } from './vet-profile-appt.component';

describe('VetProfileApptComponent', () => {
  let component: VetProfileApptComponent;
  let fixture: ComponentFixture<VetProfileApptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetProfileApptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VetProfileApptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

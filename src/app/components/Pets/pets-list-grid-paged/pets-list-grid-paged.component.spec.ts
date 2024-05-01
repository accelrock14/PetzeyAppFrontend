import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsListGridPagedComponent } from './pets-list-grid-paged.component';

describe('PetsListGridPagedComponent', () => {
  let component: PetsListGridPagedComponent;
  let fixture: ComponentFixture<PetsListGridPagedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsListGridPagedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetsListGridPagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

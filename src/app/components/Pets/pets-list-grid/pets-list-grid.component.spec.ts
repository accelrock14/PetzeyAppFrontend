import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsListGridComponent } from './pets-list-grid.component';

describe('PetsListGridComponent', () => {
  let component: PetsListGridComponent;
  let fixture: ComponentFixture<PetsListGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsListGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetsListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

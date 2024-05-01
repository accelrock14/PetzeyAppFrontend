import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditPetComponent } from './create-or-edit-pet.component';

describe('CreateOrEditPetComponent', () => {
  let component: CreateOrEditPetComponent;
  let fixture: ComponentFixture<CreateOrEditPetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrEditPetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateOrEditPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsListGridWithPagesComponent } from './pets-list-grid-with-page.component';

describe('PetsListGridComponent', () => {
  let component: PetsListGridWithPagesComponent;
  let fixture: ComponentFixture<PetsListGridWithPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsListGridWithPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetsListGridWithPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

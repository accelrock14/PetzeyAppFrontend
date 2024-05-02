// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { AdminDashboardComponent } from './admin-dashboard.component';

// describe('AdminDashboardComponent', () => {
//   let component: AdminDashboardComponent;
//   let fixture: ComponentFixture<AdminDashboardComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AdminDashboardComponent]
//     })
//     .compileComponents();
    
//     fixture = TestBed.createComponent(AdminDashboardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../../services/DashboardServices/dashboard.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DashboardService', ['GetAllAppointmentsWithFilters']);

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [FormsModule, CommonModule, RouterTestingModule, HttpClientModule],
      providers: [{ provide: DashboardService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    dashboardServiceSpy = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Test initialization here
  });

  it('should fetch appointments on initialization', () => {
    dashboardServiceSpy.GetAllAppointmentsWithFilters.and.returnValue(of([])); // Mock service method
    component.ngOnInit();
    expect(dashboardServiceSpy.GetAllAppointmentsWithFilters).toHaveBeenCalled();
  });

  it('should update appointments on date, status, or doctor change', () => {
    dashboardServiceSpy.GetAllAppointmentsWithFilters.and.returnValue(of([])); // Mock service method
    component.onDateStatusDoctorChange();
    expect(dashboardServiceSpy.GetAllAppointmentsWithFilters).toHaveBeenCalled();
  });

  // Add more test cases for other functionalities as needed
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHistoryComponent } from './report-history.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

fdescribe('ReportHistoryComponent', () => {
  let component: ReportHistoryComponent;
  let fixture: ComponentFixture<ReportHistoryComponent>;
  let mockhttp: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportHistoryComponent, HttpClientTestingModule],
      providers: provideAnimations()
    })
      .compileComponents();
    mockhttp = TestBed.inject(HttpTestingController)
    fixture = TestBed.createComponent(ReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

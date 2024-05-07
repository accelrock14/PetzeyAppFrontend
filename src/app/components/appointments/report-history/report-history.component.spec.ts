import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHistoryComponent } from './report-history.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ReportHistoryComponent', () => {
  let component: ReportHistoryComponent;
  let fixture: ComponentFixture<ReportHistoryComponent>;
  let mockhttp: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportHistoryComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

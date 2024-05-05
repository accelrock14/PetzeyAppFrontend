import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from '../../../services/appointment/report.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

fdescribe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let mockhttp: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ReportService]
    })
      .compileComponents();
    mockhttp = TestBed.inject(HttpTestingController)
    TestBed.inject(ToastrService)
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the enableEdit function on clicking edit button', () => {
    let myFunctionSpy = spyOn(component, 'enableEdit');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#editbtn'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalled();
  });
});

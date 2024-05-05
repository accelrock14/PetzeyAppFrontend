import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from '../../../services/appointment/report.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

describe('ReportComponent', () => {
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

    component.myForm = new FormGroup({
      symptom: new FormControl(),
      test: new FormControl(),
      medicine: new FormControl(),
      doctor: new FormControl(),
    })
    fixture.detectChanges();
  });

  it('should call the enableEdit function on clicking edit button', () => {
    component.isDoctor = true
    let myFunctionSpy = spyOn(component, 'enableEdit');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#editbtn'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalled();
  });

  it('should call the save function on clicking save button', () => {
    component.isDoctor = true
    component.isEditing = true

    let myFunctionSpy = spyOn(component, 'save');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#savebtn'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalled();
  });

  it('should call the callToastThenExport function on clicking report button', () => {

    let myFunctionSpy = spyOn(component, 'callToastThenExport');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#reportbtn'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalled();
  });

  it('should call the updatePrescription function on clicking confirm button in update modal', () => {
    let myFunctionSpy = spyOn(component, 'updatePrescription');

    const button = fixture.debugElement.query(By.css('#updatePres'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalled();
  });

  it('should call the confirmDeleteMedicine function on clicking confirm button in delete modal', () => {
    let myFunctionSpy = spyOn(component, 'confirmDeleteMedicine');

    const button = fixture.debugElement.query(By.css('#delPres'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalled();
  });

  it('should call the activatePrescriptionModal function on clicking edit button', () => {
    component.isEditing = true
    component.isDoctor = true
    let myFunctionSpy = spyOn(component, 'activatePrescriptionModal');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#updateModal'));
    button.triggerEventHandler('click', null);
    expect(myFunctionSpy).toHaveBeenCalledWith(0);
  });
});

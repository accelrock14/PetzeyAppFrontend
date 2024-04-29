import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Report, PrescribedMedicine, Test, Prescription, Symptom } from '../../../models/appoitment-models/Report';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NgIf, FormsModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  report: Report = {
    reportID: 1,
    prescription: {
      prescriptionID: 1,
      prescribedMedicines: [
        {
          prescribedMedicineID: 1,
          medicineID: 1,
          medicine: {
            medicineID: 1,
            medicineName: 'Crocin'
          },
          numberOfDays: 10,
          consume: false,
          dosages: 1,
          comment: 'dont sadtfy asdiaasdas asdsad asd trtm sssot worter'
        },
        {
          prescribedMedicineID: 1,
          medicineID: 1,
          medicine: {
            medicineID: 1,
            medicineName: 'Crocin'
          },
          numberOfDays: 10,
          consume: false,
          dosages: 1,
          comment: 'dont sadtfy asdiaasdas asdsad asd trtm sssot worter'
        }
      ]
    },
    symptoms: [{
      symptomID: 1,
      symptom: {
        symptomID: 1,
        symptomName: 'Stress'
      },
      reportSymptomID: 1
    },
    {
      symptomID: 2,
      symptom: {
        symptomID: 2,
        symptomName: 'ECG'
      },
      reportSymptomID: 2
    }],
    tests: [{
      reportTestID: 1,
      test: {
        testID: 1,
        testName: 'ECG'
      },
      testID: 1
    }, {
      reportTestID: 2,
      test: {
        testID: 2,
        testName: 'Excercise Stress Test'
      },
      testID: 2
    }],
    heartRate: 79,
    temperature: 37,
    oxygenLevel: 14,
    recommendedDoctors: [],
    comment: 'Patient has IBS. Food intake needs to me monitored'
  }
  myForm!: FormGroup;
  disabled = false;
  ShowFilter = true;
  limitSelection = false;
  symptoms: Symptom[] = []
  tests: Test[] = [];
  selectedSymptoms: Symptom[] = [];
  selectedTests: Test[] = []
  symptomSettings: any = {};
  testSettings: any = {}


  ngOnInit(): void {
    this.symptomSettings = {
      singleSelection: false,
      idField: 'symptomID',
      textField: 'symptomName',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
    this.testSettings = {
      singleSelection: false,
      idField: 'testID',
      textField: 'testName',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    }

    this.symptoms = [
      { symptomID: 1, symptomName: "symptom 1" },
      { symptomID: 2, symptomName: "symptom 2" },
      { symptomID: 3, symptomName: "symptom 3" },
      { symptomID: 4, symptomName: "symptom 4" },
      { symptomID: 5, symptomName: "symptom 5" }
    ]
    this.tests = [
      { testID: 1, testName: "test 1" },
      { testID: 2, testName: "test 2" },
      { testID: 3, testName: "test 3" },
      { testID: 4, testName: "test 4" },
      { testID: 5, testName: "test 5" }
    ]
    this.selectedSymptoms = this.report.symptoms.map(r => r.symptom)
    this.selectedTests = this.report.tests.map(r => r.test)
    console.log(this.selectedTests)
    this.myForm = this.fb.group({
      symptom: [this.selectedSymptoms],
      test: [this.selectedTests]
    });
  }


  constructor(private fb: FormBuilder) { }

  isEditing = false;

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {

    this.isEditing = false;
  }

  validateNumber(event: KeyboardEvent): void {
    const key = event.key;
    // Allow only numbers and backspace
    if (!(key >= '0' && key <= '9') && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}

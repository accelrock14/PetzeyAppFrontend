import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Report, PrescribedMedicine, Test, Prescription } from '../../../models/appoitment-models/Report';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NgIf, FormsModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
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
    test: [{
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

  ngOnInit(): void {
  }

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

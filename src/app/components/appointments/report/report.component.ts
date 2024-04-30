import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { IReport } from '../../../models/appoitment-models/Report';
import { ReportTest } from '../../../models/appoitment-models/ReportTest';
import { Test } from '../../../models/appoitment-models/Test';
import { ReportSymptom } from '../../../models/appoitment-models/ReportSymptom';
import { Symptom } from '../../../models/appoitment-models/Symptom';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReportService } from '../../../services/appointment/report.service';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { PrescribedMedicine } from '../../../models/appoitment-models/PrescribedMedicine';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NgIf, FormsModule, FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule, NgClass, CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  report: IReport = {
    ReportID: 1,
    Prescription: {
      PrescriptionID: 1,
      PrescribedMedicines: [
        {
          PrescribedMedicineID: 1,
          MedicineID: 1,
          Medicine: {
            MedicineID: 1,
            MedicineName: 'Crocin',
          },
          NumberOfDays: 10,
          Consume: false,
          Dosages: 1,
          Comment: 'dont sadtfy asdiaasdas asdsad asd trtm sssot worter',
        },
        {
          PrescribedMedicineID: 1,
          MedicineID: 1,
          Medicine: {
            MedicineID: 1,
            MedicineName: 'Crocin',
          },
          NumberOfDays: 10,
          Consume: false,
          Dosages: 1,
          Comment: 'dont sadtfy asdiaasdas asdsad asd trtm sssot worter',
        },
      ],
    },
    Symptoms: [
      {
        SymptomID: 1,
        Symptom: {
          SymptomID: 1,
          SymptomName: 'Stress',
        },
        ReportSymptomID: 1,
      },
      {
        SymptomID: 2,
        Symptom: {
          SymptomID: 2,
          SymptomName: 'ECG',
        },
        ReportSymptomID: 2,
      },
    ],
    Tests: [
      {
        ReportTestID: 1,
        Test: {
          TestID: 1,
          TestName: 'ECG',
        },
        TestID: 1,
      },
      {
        ReportTestID: 2,
        Test: {
          TestID: 2,
          TestName: 'Excercise Stress Test',
        },
        TestID: 2,
      },
    ],
    HeartRate: 79,
    Temperature: 37,
    OxygenLevel: 14,
    RecommendedDoctors: [],
    Comment: 'Patient has IBS. Food intake needs to me monitored',
  };
  prescriptionForm = {
    prescribedMedicineID: 0,
    medicine: 0,
    days: 0,
    consume: '',
    dosage: [false, false, false],
    comment: ''
  }
  myForm!: FormGroup;
  disabled = false;
  ShowFilter = true;
  limitSelection = false;
  symptoms: Symptom[] = [];
  tests: Test[] = [];
  selectedSymptoms: any[] = [];
  selectedTests: any[] = [];
  symptomSettings: any = {};
  testSettings: any = {};
  deleteMedicineID: number = 0;

  ngOnInit(): void {
    this.reportService.getReport(1).subscribe((r) => {
      this.report = r;

      this.symptomSettings = {
        singleSelection: false,
        idField: 'SymptomID',
        textField: 'SymptomName',
        enableCheckAll: false,
        itemsShowLimit: 3,
        allowSearchFilter: this.ShowFilter,
      };
      this.testSettings = {
        singleSelection: false,
        idField: 'TestID',
        textField: 'TestName',
        enableCheckAll: false,
        itemsShowLimit: 3,
        allowSearchFilter: this.ShowFilter,
      };

      this.reportService.getAllSymptoms().subscribe((s) => {
        this.symptoms = s;
      });

      this.reportService.getAllTests().subscribe((t) => {
        this.tests = t;
      });
      this.selectedSymptoms = this.report.Symptoms.map((r) => r.Symptom);
      this.selectedTests = this.report.Tests.map((r) => r.Test);
      console.log(this.selectedTests);
      this.myForm = this.fb.group({
        symptom: [this.selectedSymptoms],
        test: [this.selectedTests],
      });
    });
  }

  constructor(private fb: FormBuilder, private reportService: ReportService) { }

  isEditing = false;

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.isEditing = false;
    this.reportService.patchReport(1, this.report).subscribe((p) => {
      console.log(p);
    });
  }

  onSelectSymptom(symptom: ListItem) {
    let newSymptom: Symptom = symptom as unknown as Symptom;
    var reportSymptom: ReportSymptom = {
      SymptomID: newSymptom.SymptomID,
      ReportSymptomID: 1,
      Symptom: null,
    };
    this.report.Symptoms.push(reportSymptom);
  }
  onDeselectSymptom(symptom: ListItem) {
    let newSymptom: Symptom = symptom as unknown as Symptom;
    let index: number = this.report.Symptoms.findIndex(
      (s) => s.SymptomID == newSymptom.SymptomID
    );
    this.report.Symptoms.splice(index, 1);
  }

  onSelectTest(test: ListItem) {
    let newTest: Test = test as unknown as Test;
    var reportTest: ReportTest = {
      TestID: newTest.TestID,
      ReportTestID: 1,
      Test: null,
    };
    this.report.Tests.push(reportTest);
  }
  onDeselectTest(test: ListItem) {
    let newTest: Test = test as unknown as Test;
    let index: number = this.report.Tests.findIndex(
      (t) => t.TestID == newTest.TestID
    );
    this.report.Tests.splice(index, 1);
  }

  getSymptomById(id: number): Symptom | undefined {
    return this.symptoms.find((s) => {
      if (s.SymptomID != null && s.SymptomID == id) {
        return s;
      } else {
        return undefined;
      }
    });
  }
  getTestById(id: number): Test | undefined {
    return this.tests.find((t) => {
      if (t.TestID != null && t.TestID == id) {
        return t;
      } else {
        return undefined;
      }
    });
  }

  validateNumber(event: KeyboardEvent): void {
    const key = event.key;
    // Allow only numbers and backspace
    if (!(key >= '0' && key <= '9') && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  setDeleteMedicineID(medicineID: number) {
    this.deleteMedicineID = medicineID;
  }

  confirmDeleteMedicine() {
    console.log(this.deleteMedicineID);
  }

  activatePrescriptionModal(id: number) {
    if (id == 0) {
      this.prescriptionForm.prescribedMedicineID = 0
      this.prescriptionForm.medicine = 0
      this.prescriptionForm.days = 0
      this.prescriptionForm.dosage = [false, false, false]
      this.prescriptionForm.consume = ''
      this.prescriptionForm.comment = ''
    }
    else {
      let prescribedMedicine: PrescribedMedicine | undefined = this.report.Prescription.PrescribedMedicines.find(p => p.PrescribedMedicineID == id)
      if (prescribedMedicine != undefined) {
        this.prescriptionForm.prescribedMedicineID = prescribedMedicine?.PrescribedMedicineID
        this.prescriptionForm.medicine = prescribedMedicine.MedicineID
        this.prescriptionForm.days = prescribedMedicine.NumberOfDays
        this.prescriptionForm.dosage = [false, false, false]
        this.prescriptionForm.consume = 'before'
        this.prescriptionForm.comment = prescribedMedicine.Comment
      }
    }
  }
  updatePrescription() {

  }
}

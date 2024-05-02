import { CommonModule, NgClass, NgIf } from '@angular/common';
import domtoimage from 'dom-to-image';

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
import { Medicine } from '../../../models/appoitment-models/Medicine';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DoctorDTO } from '../../../models/appoitment-models/DoctorDTO';
import { RecommendedDoctor } from '../../../models/appoitment-models/RecommendedDoctor';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { VetsserviceService } from '../../../services/VetsServices/vetsservice.service';
import { IVetCardDTO } from '../../../models/Vets/IVetCardDto';
import { AuthService } from '../../../services/UserAuthServices/auth.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgClass,
    CommonModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  @Input() reportId: number = 3;
  @Input() doctorId: string = '';

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
    comment: '',
  };
  myForm!: FormGroup;
  ShowFilter = true;
  limitSelection = false;
  symptoms: Symptom[] = [];
  tests: Test[] = [];
  medicines: Medicine[] = [];
  doctors: IVetCardDTO[] = [];
  selectedSymptoms: any[] = [];
  selectedTests: any[] = [];
  selectedDoctors: any[] = [];
  symptomSettings: any = {};
  testSettings: any = {};
  medicineSettings: any = {};
  doctorSettings: any = {};
  deletePrescribedMedicineID: number = 0;
  isDoctor: boolean = false;

  ngOnInit(): void {
    this.reportService.getReport(this.reportId).subscribe((r) => {
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
      this.medicineSettings = {
        singleSelection: true,
        idField: 'MedicineID',
        textField: 'MedicineName',
        enableCheckAll: false,
        itemsShowLimit: 3,
        allowSearchFilter: this.ShowFilter,
      };
      this.doctorSettings = {
        singleSelection: false,
        idField: 'VetId',
        textField: 'Name',
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
      this.reportService.getAllMedicines().subscribe((m) => {
        this.medicines = m;
      });
      this.vetService.getAllVets().subscribe((v) => {
        this.doctors = v;
      });
      this.selectedSymptoms = this.report.Symptoms.map((s) => s.Symptom);
      this.selectedTests = this.report.Tests.map((r) => r.Test);
      this.selectedDoctors = this.report.RecommendedDoctors.map(
        (d) => d.DoctorID
      );

      this.myForm = this.fb.group({
        symptom: [this.selectedSymptoms],
        test: [this.selectedTests],
        medicine: [],
        doctor: [this.selectedDoctors],
      });
      this.isDoctor = this.authService.getRoleFromToken() == 'Doctor';
    });
  }

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private elementRef: ElementRef,
    private vetService: VetsserviceService,
    private authService: AuthService
  ) {}

  isEditing = false;

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.isEditing = false;
    this.reportService
      .patchReport(this.reportId, this.report)
      .subscribe((p) => {
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

  onSelectDoctor(doctor: ListItem) {
    let newDoctor: DoctorDTO = doctor as unknown as DoctorDTO;
    var recommendedDoctor: RecommendedDoctor = {
      DoctorID: newDoctor.DoctorID,
      ID: 1,
    };
    this.report.RecommendedDoctors.push(recommendedDoctor);
  }
  onDeselectDoctor(doctor: ListItem) {
    let newDoctor: DoctorDTO = doctor as unknown as DoctorDTO;
    let index: number = this.report.RecommendedDoctors.findIndex(
      (d) => d.DoctorID == newDoctor.DoctorID
    );
    this.report.RecommendedDoctors.splice(index, 1);
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

  getMedicineById(id: number): Medicine | undefined {
    return this.medicines.find((m) => {
      if (m.MedicineID != null && m.MedicineID == id) {
        return m;
      } else {
        return undefined;
      }
    });
  }

  getDoctorById(id: string): IVetCardDTO | undefined {
    return this.doctors.find((d) => {
      if (d.VetId.toString() == id) {
        return d;
      } else return undefined;
    });
  }

  validateNumber(event: KeyboardEvent): void {
    const key = event.key;
    // Allow only numbers and backspace
    if (!(key >= '0' && key <= '9') && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  setDeleteMedicineID(prescribedMedicineID: number) {
    this.deletePrescribedMedicineID = prescribedMedicineID;
  }

  confirmDeleteMedicine() {
    this.reportService
      .DeletePrescription(this.deletePrescribedMedicineID)
      .subscribe((p) => {
        this.reportService.getReport(this.reportId).subscribe((r) => {
          this.report = r;
        });
      });
  }

  activatePrescriptionModal(id: number) {
    this.myForm.get('medicine')?.reset();
    if (id == 0) {
      this.prescriptionForm.prescribedMedicineID = 0;
      this.prescriptionForm.medicine = 0;
      this.prescriptionForm.days = 0;
      this.prescriptionForm.dosage = [false, false, false];
      this.prescriptionForm.consume = '';
      this.prescriptionForm.comment = '';
    } else {
      let prescribedMedicine: PrescribedMedicine | undefined =
        this.report.Prescription.PrescribedMedicines.find(
          (p) => p.PrescribedMedicineID == id
        );
      if (prescribedMedicine != undefined) {
        this.prescriptionForm.prescribedMedicineID =
          prescribedMedicine?.PrescribedMedicineID;
        this.prescriptionForm.medicine = prescribedMedicine.MedicineID;
        this.prescriptionForm.days = prescribedMedicine.NumberOfDays;
        this.prescriptionForm.dosage = [false, false, false];
        //morning
        if (
          prescribedMedicine.Dosages == 0 ||
          prescribedMedicine.Dosages == 3 ||
          prescribedMedicine.Dosages == 4 ||
          prescribedMedicine.Dosages == 6
        ) {
          this.prescriptionForm.dosage[0] = true;
        }
        //  afternoon
        if (
          prescribedMedicine.Dosages == 1 ||
          prescribedMedicine.Dosages == 3 ||
          prescribedMedicine.Dosages == 5 ||
          prescribedMedicine.Dosages == 6
        ) {
          this.prescriptionForm.dosage[1] = true;
        }
        //  night
        if (
          prescribedMedicine.Dosages == 2 ||
          prescribedMedicine.Dosages == 4 ||
          prescribedMedicine.Dosages == 5 ||
          prescribedMedicine.Dosages == 6
        ) {
          this.prescriptionForm.dosage[2] = true;
        }

        if (prescribedMedicine.Consume) {
          this.prescriptionForm.consume = 'before';
        } else {
          this.prescriptionForm.consume = 'after';
        }
        this.prescriptionForm.comment = prescribedMedicine.Comment;
      }
    }
  }
  updatePrescription() {
    let prescribedMedicine: PrescribedMedicine = {
      PrescribedMedicineID: 0,
      MedicineID: this.prescriptionForm.medicine,
      Medicine: null,
      NumberOfDays: this.prescriptionForm.days,
      Consume: false,
      Dosages: 0,
      Comment: this.prescriptionForm.comment,
    };

    if (this.prescriptionForm.consume == 'before') {
      prescribedMedicine.Consume = true;
    }

    // dosage
    if (this.prescriptionForm.dosage[0]) {
      prescribedMedicine.Dosages = 0;
      if (this.prescriptionForm.dosage[1] && this.prescriptionForm.dosage[2]) {
        prescribedMedicine.Dosages = 6;
      } else if (this.prescriptionForm.dosage[1]) {
        prescribedMedicine.Dosages = 3;
      } else if (this.prescriptionForm.dosage[2]) {
        prescribedMedicine.Dosages = 4;
      }
    } else if (this.prescriptionForm.dosage[1]) {
      prescribedMedicine.Dosages = 1;
      if (this.prescriptionForm.dosage[2]) {
        prescribedMedicine.Dosages = 5;
      }
    } else {
      prescribedMedicine.Dosages = 2;
    }

    if (this.prescriptionForm.prescribedMedicineID == 0) {
      this.reportService
        .AddPrescription(
          this.report.Prescription.PrescriptionID,
          prescribedMedicine
        )
        .subscribe((p) => {
          prescribedMedicine.PrescribedMedicineID = parseInt(p.toString());
          this.report.Prescription.PrescribedMedicines.push(prescribedMedicine);
        });
    } else {
      this.reportService
        .UpdatePrescription(
          this.prescriptionForm.prescribedMedicineID,
          prescribedMedicine
        )
        .subscribe((p) => {
          this.reportService.getReport(this.reportId).subscribe((r) => {
            this.report = r;
          });
        });
    }
  }

  selectMedicine(medicine: ListItem) {
    let selectMed: Medicine = medicine as unknown as Medicine;
    this.prescriptionForm.medicine = selectMed.MedicineID;
  }

  @Output() messageEvent = new EventEmitter<string>();

  captureElementAsCanvas(element: any, index: number) {
    return html2canvas(element, {
      scale: window.devicePixelRatio, // Scale for high-density displays
      onclone: function (clonedDoc) {
        // Modify cloned document if needed (e.g., removing scrollbars)
        const clonedElement = clonedDoc.querySelector(
          '.capture-section'
        ) as HTMLElement; // Example: select element by class name
        if (clonedElement && index == 2) {
          // Increase the size (scale) of the cloned element

          clonedElement.style.width = `${clonedElement.offsetWidth * 2}px`; // Adjust width after scaling
          clonedElement.style.height = `${clonedElement.offsetHeight * 1}px`; // Adjust height after scaling
        }
      },
    });
  }

  async exportToPDF() {
    // const page = document.getElementById('elementToExport') as HTMLElement;

    // Function to capture a specific element (e.g., a div) as a canvas
    const doc = new jsPDF();
    // Array to hold promises for each section capture
    const sectionPromises: any = [];

    // Define the div elements you want to capture (adjust as needed)
    const divsToCapture = document.querySelectorAll('.capture-section'); // Example: select divs with class "capture-section"

    // Loop through each div to capture
    for (var i = 0; i < 3; i++) {
      const promise = this.captureElementAsCanvas(divsToCapture[i], i);
      sectionPromises.push(promise);
    }

    // divsToCapture.forEach((div) => {
    //   const promise = this.captureElementAsCanvas(div);
    //   sectionPromises.push(promise);
    // });

    // When all section captures are complete
    Promise.all(sectionPromises).then((sectionCanvases) => {
      // Determine the total height needed for the final composite canvas
      let totalHeight = 0;

      totalHeight = sectionCanvases[0].height + sectionCanvases[2].height;

      // sectionCanvases.forEach((canvas) => {
      //   totalHeight += canvas.height;
      // });

      // Create a final composite canvas with the calculated dimensions
      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = sectionCanvases[0].width * 2; // Assume all captured sections have the same width
      compositeCanvas.height = totalHeight;

      // Create a context for drawing on the composite canvas
      const ctx = compositeCanvas.getContext('2d');
      let yOffset = 0;
      let xOffset = 0;

      // Draw each captured section onto the composite canvas
      for (var i = 0; i < 3; i++) {
        ctx?.drawImage(sectionCanvases[i], xOffset, yOffset);
        xOffset += sectionCanvases[i].width;

        if (i == 1) {
          yOffset += sectionCanvases[i].height;
          xOffset = 0;
        }
      }
      // sectionCanvases.forEach((canvas) => {
      //   ctx?.drawImage(canvas, 0, yOffset);
      //   yOffset += canvas.height;
      // });

      // Convert the composite canvas to a data URL (or use it as needed)
      const imgData = compositeCanvas.toDataURL('image/png');
      // console.log(imgData);

      this.messageEvent.emit(imgData);
      // doc.addImage(imgData, 'PNG', 10, 10, 200, 150);
      // doc.save('report.pdf');
    });
  }
}
